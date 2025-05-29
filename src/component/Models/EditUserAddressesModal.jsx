"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogTitle,
  FormControl,
  Grid,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  useTheme,
  FormLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  Sheet,
  Checkbox,
} from "@mui/joy";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import {
  RiGpsFill,
  RiMapPinAddFill,
  RiMapPinRangeLine,
} from "@remixicon/react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";

import { update_address, add_address } from "../../interceptor/api";
import { useTranslation } from "react-i18next";
import { updateUserAddresses } from "@/events/actions";
import { extractAddress } from "@/helpers/functionHelpers";

const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];

const EditUserAddressesModal = ({ buttonType = "add", address = {} }) => {
  const theme = useTheme();
  const countryCode = process.env.NEXT_PUBLIC_COUNTRY_CODE;

  const [loading, setLoading] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
  const initialCenter = {
    lat: Number(process.env.NEXT_PUBLIC_LATITUDE),
    lng: Number(process.env.NEXT_PUBLIC_LONGITUDE),
  };

  const zoomLevel = 16;

  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialCenter);

  const { t } = useTranslation();

  const [prefill, setPrefill] = useState({
    id: "",
    address: "",
    area: "",
    mobile: "",
    landmark: "",
    city: "",
    pincode: "",
    type: "",
    latitude: "",
    longitude: "",
    is_default: 0,
  });

  useEffect(() => {
    if (buttonType == "add") {
      setPrefill({
        id: "",
        address: "",
        area: "",
        mobile: "",
        landmark: "",
        city: "",
        pincode: "",
        type: "",
        latitude: "",
        longitude: "",
        is_default: 0,
      });
      setSelectedLocation(initialCenter);
    } else {
      setPrefill({
        id: address.id,
        address: address.address,
        area: address.area,
        mobile: address.mobile,
        landmark: address.landmark,
        city: address.city,
        pincode: address.pincode,
        type: address.type,
        latitude: address.latitude,
        longitude: address.longitude,
        is_default: Number(address.is_default),
      });
      setSelectedLocation({
        lat: Number(address.latitude),
        lng: Number(address.longitude),
      });
    }
  }, [open, buttonType]); // eslint-disable-line

  useEffect(() => {
    if (buttonType == "edit") {
      setPrefill({
        id: address.id,
        address: address.address,
        area: address.area,
        mobile: address.mobile,
        landmark: address.landmark,
        city: address.city,
        pincode: address.pincode,
        type: address.type,
        latitude: address.latitude,
        longitude: address.longitude,
        is_default: Number(address.is_default),
      });
      setSelectedLocation({
        lat: Number(address.latitude),
        lng: Number(address.longitude),
      });
    }
  }, []); // eslint-disable-line

  const fieldVerify = () => {
    const { mobile, city, address, landmark, pincode, area, type } = prefill;

    // Check if any required fields are empty
    if (!mobile) {
      toast.error("Please provide the Mobile Number");
      return;
    }
    if (!city) {
      toast.error("Please provide the City");
      return;
    }
    if (!address) {
      toast.error("Please provide the Address");
      return;
    }
    if (!landmark) {
      toast.error("Please provide the Landmark");
      return;
    }
    if (!pincode) {
      toast.error("Please provide the Pincode/Zip Code");
      return;
    }
    if (!area) {
      toast.error("Please provide the Area");
      return;
    }
    if (!type) {
      toast.error("Please provide the Address Type");
      return;
    }
    return true;
  };

  const addValueProps = (name) => {
    if (name) {
      return {
        value: prefill[name] || "",
        onChange: (e) => {
          setPrefill({ ...prefill, [name]: e?.target?.value ?? e });
        },
      };
    }
  };

  const containerStyle = {
    width: "100%",
    height: "350px",
  };
  const handleMapClick = async (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
    setSelectedLocation({ lat: latitude, lng: longitude });

    try {
      const results = await geocodeByAddress(`${latitude},${longitude}`);
      if (results && results.length > 0) {
        const address = results[0].formatted_address;
        const area = results[0].address_components.find(
          (component) =>
            component.types.includes("sublocality_level_2") ||
            component.types.includes("sublocality_level_1") ||
            component.types.includes("sublocality") ||
            component.types.includes("plus_code") ||
            component.types.includes("political")
        );
        const city = results[0].address_components.find((component) =>
          component.types.includes("locality")
        );
        const postalCOde = results[0].address_components.find((component) =>
          component.types.includes("postal_code")
        )?.long_name;
        const landmark = results[0].address_components.find((component) =>
          component.types.includes("landmark")
        );
        if (city) {
          setPrefill({
            ...prefill,
            address: address,
            area: area?.long_name ?? "",
            city: city.long_name,
            pincode: postalCOde,
            landmark: landmark?.long_name ?? "",
            latitude: latitude,
            longitude: longitude,
          });
        } else {
          return toast.error("Please Select City");
        }
      }
    } catch (error) {
      console.error("Error geocoding coordinates:", error);
    }
  };

  const handleAddressToggle = async () => {
    setPrefill({
      ...prefill,
    });

    let verify = fieldVerify();
    if (!verify) {
      return;
    }
    try {
      setLoading(true);
      let addUserAddress;
      let editUserAddress;
      if (buttonType == "edit") {
        editUserAddress = await update_address({
          address_id: prefill.id,
          mobile: prefill.mobile,
          city: prefill.city,
          add: prefill.address,
          landmark: prefill.landmark,
          pincode: prefill.pincode,
          longitude: prefill.longitude,
          latitude: prefill.latitude,
          area: prefill.area,
          type: prefill.type,
          is_default: prefill.is_default,
        });

        if (editUserAddress && editUserAddress.error) {
          toast.error("Address Not Edited");
        } else {
          updateUserAddresses();
          toast.success("Your Address is successfully updated ");
          setOpen(false);
        }
      } else {
        addUserAddress = await add_address({
          mobile: prefill.mobile,
          city: prefill.city,
          adds: prefill.address,
          landmark: prefill.landmark,
          pincode: prefill.pincode,
          longitude: prefill.longitude,
          latitude: prefill.latitude,
          area: prefill.area,
          address_type: prefill.type,
          is_default: prefill.is_default,
        });
        if (addUserAddress && addUserAddress.error) {
          toast.error("Address not added");
        } else {
          updateUserAddresses();
          toast.success("Address Successfully added");
          setOpen(false);
        }
      }
    } catch (error) {
      console.log("error while getting adding address", error);
    } finally {
      setLoading(false);
    }
  };
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setPrefill((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
          handleMapClick({
            latLng: { lat: () => latitude, lng: () => longitude },
          });
        },
        (error) => {
          toast.error("unable-to-retrieve-location");
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      toast.error("geolocation not supported");
    }
  }, [t]);

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      const completeAddress = extractAddress(results[0]);
      if (completeAddress.city === "") {
        return toast.error("Please Select City");
      }

      setPrefill((prev) => ({
        ...prev,
        address: results[0].formatted_address,
      }));
      setSelectedLocation(latLng);

      const { lat: latitude, lng: longitude } = latLng;

      handleMapClick({
        latLng: { lat: () => latitude, lng: () => longitude },
      });
    } catch (error) {
      console.error("Error selecting place: ", error);
    }
  };

  const handleChange = (newAddress) => {
    setPrefill((prev) => ({
      ...prev,
      address: newAddress,
    }));
  };

  return (
    <Box>
      {buttonType === "edit" ? (
        <Button
          variant="soft"
          onClick={() => setOpen(true)}
          sx={{
            color: theme.palette.common.black,
            backgroundColor: theme.palette.background.level1,
          }}
        >
          {t("edit")}
        </Button>
      ) : (
        <Box
          sx={{
            cursor: "pointer",
            px: 3,
            py: 3,
            display: "flex",
            gap: 2,
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.primary[500],
            borderRadius: "md",
          }}
          onClick={() => {
            setOpen(true);
          }}
          className="boxShadow"
        >
          <RiMapPinAddFill />
          <Typography>{t("add-address")}</Typography>
        </Box>
      )}
      <Modal
        sx={{ overflow: "scroll", maxHeight: "100%" }}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <ModalDialog
          sx={{
            width: 800,
            maxHeight: "100%",
            overflowY: "scroll",
          }}
        >
          <ModalClose />
          <DialogTitle>
            <Typography fontSize={"lg"} fontWeight={"xl"}>
              {t("choose-your-location")}
            </Typography>
          </DialogTitle>

          {isLoaded && (
            <Grid container spacing={2} sx={{ flexGrow: 1, mt: 2 }}>
              <Grid xs={12} width={"100%"}>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={selectedLocation}
                  zoom={zoomLevel}
                  onClick={handleMapClick}
                  options={{
                    streetViewControl: true,
                    maxZoom: 16,
                    fullscreenControl: true,
                    mapTypeControl: true, // Enable the default map type control
                    zoomControl: true,
                    controlSize: 35,
                    mapTypeControlOptions: {
                      // Customize the map type control if needed
                      position: window.google?.maps?.ControlPosition.TOP_Left,
                      style:
                        window.google?.maps?.MapTypeControlStyle.HORIZONTAL_BAR,
                    },
                  }}
                  onLoad={(map) => {
                    // Only add the custom "Current Location" button
                    const controlButton = document.createElement("button");
                    controlButton.innerHTML =
                      '<span class="material-icons">gps_fixed</span> Current Location';
                    controlButton.className = "custom-map-control-button";
                    controlButton.addEventListener("click", getCurrentLocation);

                    map.controls[
                      window.google?.maps.ControlPosition.TOP_CENTER
                    ].push(controlButton);
                  }}
                >
                  <MarkerF position={selectedLocation} />
                </GoogleMap>
              </Grid>
            </Grid>
          )}

          <Grid container spacing={2} sx={{ flexGrow: 1, mt: 2 }}>
            {isLoaded && (
              <Grid xs={12} width={"100%"}>
                <FormControl>
                  <FormLabel>{t("address")}</FormLabel>
                  <Box
                    sx={{
                      position: "relative", // Ensure relative positioning of the parent box
                    }}
                  >
                    <PlacesAutocomplete
                      value={prefill.address}
                      onChange={handleChange}
                      onSelect={handleSelect}
                    >
                      {({
                        getInputProps,
                        suggestions,
                        getSuggestionItemProps,
                        loading,
                      }) => (
                        <div>
                          <Input
                            {...getInputProps({
                              placeholder: t("Fill-in-the-Address"),
                              className: "location-search-input",
                            })}
                          />
                          <Box
                            className="autocomplete-dropdown-container"
                            sx={{
                              position: "absolute",
                              top: "100%",
                              left: 0,
                              right: 0,
                              zIndex: 1000,
                              maxHeight: 200,
                              overflowY: "auto",
                              backgroundColor: "white",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                            }}
                          >
                            {loading && (
                              <Box
                                sx={{
                                  paddingLeft: 4,
                                  backgroundColor:
                                    theme.palette.background.body,
                                }}
                              >
                                Loading...
                              </Box>
                            )}
                            {suggestions.map((suggestion, index) => {
                              const className = suggestion.active
                                ? "suggestion-item--active"
                                : "suggestion-item";
                              const style = suggestion.active
                                ? {
                                    backgroundColor:
                                      theme.palette.background.level3,
                                    cursor: "pointer",
                                    padding: 4,
                                    paddingLeft: 16,
                                    border: 1,
                                  }
                                : {
                                    backgroundColor:
                                      theme.palette.background.body,
                                    cursor: "pointer",
                                    padding: 4,
                                    paddingLeft: 16,
                                    border: 1,
                                  };
                              return (
                                <Box
                                  {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                  })}
                                  key={index}
                                >
                                  <span>{suggestion.description}</span>
                                </Box>
                              );
                            })}
                          </Box>
                        </div>
                      )}
                    </PlacesAutocomplete>
                  </Box>
                </FormControl>
              </Grid>
            )}
            <Grid xs={12} width={"100%"}>
              <FormControl>
                <FormLabel> {t("area")} </FormLabel>
                <Input
                  disabled={true}
                  placeholder={t("Fill-in-the-Area")}
                  {...addValueProps("area")}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} width={"100%"}>
              <FormControl>
                <FormLabel> {t("city")}</FormLabel>
                <Input
                  disabled={true}
                  placeholder={t("Fill-in-the-City")}
                  {...addValueProps("city")}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} width={"100%"}>
              <FormControl>
                <FormLabel> {t("pincode")} </FormLabel>
                <Input
                  disabled={true}
                  placeholder={t("Fill-in-the-Pincode")}
                  {...addValueProps("pincode")}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} width={"100%"}>
              <FormControl>
                <FormLabel> {t("landmark")} </FormLabel>
                <Input
                  placeholder={t("Fill-in-the-Landmark")}
                  {...addValueProps("landmark")}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} width={"100%"}>
              <FormLabel sx={{ mb: 1, color: "text.tertiary" }}>
                {t("mobile-number")}
              </FormLabel>
              <PhoneInput
                country={countryCode}
                inputClass="generalClass"
                placeholder={t("enter-phone-number")}
                {...addValueProps("mobile")}
                inputStyle={{
                  width: "100%",
                  height: "45px",
                  backgroundColor:
                    theme.palette.mode === "light"
                      ? theme.palette.primary[50]
                      : "#3B3B3B",
                }}
              />
            </Grid>
            <Grid xs={12} width={"100%"}>
              <FormLabel sx={{ mb: 1, color: "text.tertiary" }}>
                Where to
              </FormLabel>
              <RadioGroup
                aria-labelledby="storage-label"
                size="sm"
                {...addValueProps("type")}
                sx={{
                  gap: 1.5,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                {["home", "office", "other"].map((value) => (
                  <Sheet
                    key={value}
                    sx={{
                      p: 2,
                      borderRadius: "md",
                      boxShadow: "sm",
                      width: "33%",
                    }}
                  >
                    <Radio
                      key={value}
                      label={value}
                      overlay
                      disableIcon
                      value={value}
                      slotProps={{
                        label: ({ checked }) => ({
                          sx: {
                            fontWeight: "lg",
                            fontSize: "md",
                            color: checked ? "text.primary" : "text.secondary",
                          },
                        }),
                        action: ({ checked }) => ({
                          sx: (theme) => ({
                            ...(checked && {
                              "--variant-borderWidth": "2px",
                              "&&": {
                                // && to increase the specificity to win the base :hover styles
                                borderColor: theme.vars.palette.primary[500],
                              },
                            }),
                          }),
                        }),
                      }}
                    />
                  </Sheet>
                ))}
              </RadioGroup>
            </Grid>
            <Grid xs={12}>
              <Checkbox
                checked={prefill.is_default == "1" ? true : false}
                onChange={() => {
                  setPrefill({
                    ...prefill,
                    is_default: prefill.is_default == "0" ? 1 : 0,
                  });
                }}
                label={t("default")}
                variant="soft"
                color="primary"
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button
              sx={{ width: "100%" }}
              color="danger"
              variant="solid"
              disabled={loading}
              onClick={() => handleAddressToggle()}
            >
              {loading
                ? t("loading")
                : buttonType == "add"
                ? t("add-address")
                : t("set-address")}
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default EditUserAddressesModal;
