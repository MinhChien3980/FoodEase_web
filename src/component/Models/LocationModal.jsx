import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  DialogActions,
  Sheet,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  useTheme,
} from "@mui/joy";
import debounce from "lodash.debounce";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { RiCrosshair2Fill, RiMapPinFill } from "@remixicon/react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { extractAddress } from "@/helpers/functionHelpers";
import { is_city_deliverable } from "@/interceptor/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAddress as setNewAddress } from "@/store/reducers/selectedMapAddressSlice";
import { useMediaQuery } from "@mui/material";
import { onCityChange } from "@/events/events";
import { useTranslation } from "react-i18next";
import CityChips from "../Chip/CityChips";
const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];
const LocationModal = () => {
  const { t } = useTranslation();
  const initialCenter = {
    lat: Number(process.env.NEXT_PUBLIC_LATITUDE),
    lng: Number(process.env.NEXT_PUBLIC_LONGITUDE),
  }; // Default coordinates
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
  const [disableUseLocationBtn, setDisableUseLocationBtn] = useState(false);

  const LatLng = useState({
    lat: useSelector((state) => state.selectedCity.value?.lat),
    lng: useSelector((state) => state.selectedCity.value?.lat),
  });

  const zoomLevel = 11;
  const city = useSelector((state) => state.selectedCity.value);
  const [open, setOpen] = useState(false);
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialCenter); // Initial selected location

  const cities = useSelector((state) => state.homepage?.homeCities || []);

  useEffect(() => {
    setSelectedLocation({ lat: Number(city.lat), lng: Number(city.lng) });
    if (!open) {
      setSelectedLocation({ lat: Number(city.lat), lng: Number(city.lng) });
    }
  }, [city, open]);
  const autocompleteRef = useRef(null); // Ref for Autocomplete component
  const [address, setAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const dispatch = useDispatch();

  const handleLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isMd = useMediaQuery(theme.breakpoints.up("md"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const handleMapClick = async (event) => {
    setSelectedLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });

    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();

    try {
      const results = await geocodeByAddress(`${latitude},${longitude}`);
      if (results && results.length > 0) {
        const address = results[0].formatted_address;

        // You can extract city name or other relevant information from the address
        const city = results[0].address_components.find((component) =>
          component.types.includes("locality")
        );
        const state = getAddressComponent("administrative_area_level_1");
        const country = getAddressComponent("country");
        const postalCode = getAddressComponent("postal_code");

        if (city) {
          setDisableUseLocationBtn(false);
          let delivery;
          const name = city.long_name;
          try {
            delivery = await is_city_deliverable(name);

            if (delivery.error) {
              setDisableUseLocationBtn(true);
              return toast.error(delivery.message);
            } else {
              setDisableUseLocationBtn(false);
              const city_id = delivery.city_id;
              onCityChange({
                city_id,
              });
              dispatch(
                setNewAddress({
                  city: city.long_name,
                  lat: latitude,
                  lng: longitude,
                  state,
                  country,
                  postalCode,
                })
              );
              // setOpen(false);

              return toast.success(delivery.message);
            }
          } catch (error) {
            return toast.error(error.message);
          }
        } else {
          setDisableUseLocationBtn(true);
          return toast.error("Please Select City");
        }
      }
    } catch (error) {
      console.error("Error geocoding coordinates:", error);
    }
  };

  const handleMapDrag = async (event) => {
    // setSelectedLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    // const latitude = event.latLng.lat();
    // const longitude = event.latLng.lng();
    // try {
    //   const results = await geocodeByAddress(`${latitude},${longitude}`);
    //   if (results && results.length > 0) {
    //     const address = results[0].formatted_address;
    //     // You can extract city name or other relevant information from the address
    //     const city = results[0].address_components.find((component) =>
    //       component.types.includes("locality")
    //     );
    //     if (city) {
    //       let delivery;
    //       const name = completeAddress.city;
    //       try {
    //         delivery = await is_city_deliverable(name);
    //         dispatch(setNewAddress({ city: city.long_name }));
    //         if (delivery.error) {
    //           return toast.error(delivery.message);
    //         } else {
    //           const city_id = delivery?.city_id;
    //           onCityChange({
    //             city_id,
    //           });
    //           // setOpen(false);
    //           return toast.success(delivery.message);
    //         }
    //       } catch (error) {
    //         return toast.error(error.message);
    //       }
    //     } else {
    //       return toast.error("Please Select City");
    //     }
    //   }
    // } catch (error) {
    //   console.error("Error geocoding coordinates:", error);
    // }
  };

  const mapOptions = {
    streetViewControl: false,
    zoomControl: true,
  };

  const handlePlaceChanged = (place) => {
    if (!place) return;
    const newLocation = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    };
    setSelectedLocation(newLocation);
    setMap((map) => map.setCenter(newLocation)); // Center map on selected place
  };

  const handleSelect = async (selectedAddress) => {
    setAddress(selectedAddress);
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      const completeAddress = extractAddress(results[0]);
      const addressComponents = results[0].address_components;
      const getAddressComponent = (type) =>
        addressComponents.find((component) => component.types.includes(type));
      setSelectedAddress(results[0].formatted_address);
      setSelectedLocation(latLng);
      const state = getAddressComponent(
        "administrative_area_level_1"
      )?.long_name;
      const country = getAddressComponent("country")?.long_name;
      const postalCode = getAddressComponent("postal_code")?.long_name;

      const { lat: latitude, lng: longitude } = latLng;

      if (completeAddress.city === "") {
        setDisableUseLocationBtn(true);
        return toast.error("Please Select City");
      } else {
        setDisableUseLocationBtn(false);
      }

      let delivery;
      const name = completeAddress.city;
      try {
        delivery = await is_city_deliverable(name);

        if (delivery.error) {
          setDisableUseLocationBtn(true);
          return toast.error(delivery.message);
        } else {
          setDisableUseLocationBtn(false);
          dispatch(
            setNewAddress({
              city: completeAddress.city,
              lat: latitude,
              lng: longitude,
              state,
              country,
              postalCode,
            })
          );
          const city_id = delivery?.city_id;
          onCityChange({
            city_id,
          });
          setOpen(false);

          return toast.success(delivery.message);
        }
      } catch (error) {
        console.log(error);
        return toast.error(error.message);
      }
    } catch (error) {
      console.error("Error selecting place: ", error);
    }
  };

  const handleLocationButtonClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Do something with the latitude and longitude values
          setSelectedLocation({ lat: latitude, lng: longitude });
          try {
            const results = await geocodeByAddress(`${latitude},${longitude}`);
            if (results && results.length > 0) {
              const address = results[0].formatted_address;
              const addressComponents = results[0].address_components;
              const getAddressComponent = (type) =>
                addressComponents.find((component) =>
                  component.types.includes(type)
                );

              // You can extract city name or other relevant information from the address
              const city = results[0].address_components.find((component) =>
                component.types.includes("locality")
              );
              const state = getAddressComponent(
                "administrative_area_level_1"
              )?.long_name;
              const country = getAddressComponent("country")?.long_name;
              const postalCode = getAddressComponent("postal_code")?.long_name;

              if (city) {
                setDisableUseLocationBtn(false);
                let delivery;
                try {
                  const name = city.long_name,
                    delivery = await is_city_deliverable(name);
                  if (delivery.error) {
                    setDisableUseLocationBtn(true);
                    return toast.error(delivery.message);
                  } else {
                    setDisableUseLocationBtn(false);
                    dispatch(
                      setNewAddress({
                        city: city.long_name,
                        lat: latitude,
                        lng: longitude,
                        state,
                        country,
                        postalCode,
                      })
                    );
                    const city_id = delivery?.city_id;

                    onCityChange({
                      city_id,
                    });
                    setOpen(false);
                    return toast.success(delivery.message);
                  }
                } catch (error) {
                  return toast.error("error.message");
                }
              } else {
                setDisableUseLocationBtn(true);
                return toast.error("Please Select City");
              }
            }
          } catch (error) {
            console.error("Error geocoding coordinates:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleCityClick = (city) => {
    const { id, name, latitude, longitude } = city;
    setAddress(name);
    setOpen(false);
    setSelectedLocation({
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    });
    onCityChange({
      city_id: id,
    });
    dispatch(
      setNewAddress({
        city: name,
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      })
    );
    toast.success(t("citySelected", { cityName: city.name }));
  };

  const debouncedHandleMapClick = debounce(handleMapClick, 500);

  if (!isLoaded) {
    return <div></div>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "inline-flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RiMapPinFill
            size={isXs ? 24 : 28}
            color={theme.palette.mode === "dark" ? "white" : "black"}
          />
        </Box>

        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          <Typography
            onClick={() => setOpen(true)}
            sx={{
              cursor: "pointer",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: "xl",
              fontSize: "md",
            }}
          >
            {city.city ?? "Bhuj"}
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "inline-flex" }, gap: 1 }}>
            <Typography
              onClick={() => setOpen(true)}
              sx={{
                cursor: "pointer",
                overflow: "hidden",
                fontWeight: "md",
                fontSize: "sm",
              }}
            >
              {city?.state ?? ""}
            </Typography>
            <Typography
              onClick={() => setOpen(true)}
              sx={{
                cursor: "pointer",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: "md",
                fontSize: "sm",
              }}
            >
              {city?.country ?? ""}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, width: "100%" }}></Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          sx={{
            width: 800,
            maxHeight: "100%",
            overflowY: "auto", // Enable vertical scrolling if content overflows
            marginTop: 1,
            marginBottom: 1,
          }}
        >
          <ModalClose />
          <DialogTitle>
            <Typography fontSize={"lg"} fontWeight={"xl"}>
              {t("choose-your-location")}
            </Typography>
          </DialogTitle>

          <Grid container spacing={2} sx={{ flexGrow: 1, mt: 2 }}>
            <Grid xs={12}>
              <Card
                sx={{ maxWidth: { md: "50%", xs: "100%" }, cursor: "pointer" }}
                onClick={() => {
                  handleLocationButtonClick();
                }}
              >
                <CardContent
                  orientation="horizontal"
                  sx={{ alignItems: "center" }}
                >
                  <Box>
                    <RiCrosshair2Fill color={theme.palette.primary[500]} />
                  </Box>
                  <Box>
                    <Typography fontSize={"md"} fontWeight={"lg"}>
                      {t("detect-current-location")}
                    </Typography>
                    <Typography fontSize={"sm"} fontWeight={"md"}>
                      {t("using-GPS")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={12}>
              <Box
                sx={{
                  position: "relative", // Ensure relative positioning of the parent box
                }}
              >
                <PlacesAutocomplete
                  value={address}
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
                          placeholder: "Enter address",
                          className: "location-search-input",
                        })}
                      />
                      <Box
                        className="autocomplete-dropdown-container"
                        sx={{
                          position: "absolute", // Position the dropdown absolutely
                          top: "100%", // Align it to the bottom of the input field
                          left: 0,
                          right: 0,
                          zIndex: 1000, // Ensure it appears on top of other elements
                          maxHeight: 200, // Optional: limit the height
                          overflowY: "auto", // Enable vertical scrolling if needed
                          backgroundColor: "white", // Background color for dropdown
                          boxShadow: "0 2px 5px rgba(0,0,0,0.15)", // Optional: add a shadow for better visibility
                        }}
                      >
                        {loading && (
                          <Box
                            sx={{
                              paddingLeft: 4,
                              backgroundColor: theme.palette.background.body,
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
                                backgroundColor: theme.palette.background.body,
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
              <Box mt={2}>
                <CityChips cities={cities} handleCityClick={handleCityClick} />
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ flexGrow: 1, mt: 2 }}>
            <Grid xs={12}>
              <GoogleMap
                mapContainerStyle={{
                  width: isMd ? "100%" : "100%",
                  height: isMd ? "500px" : isSm ? "400px" : "350px",
                }} // Adjust map height and width
                center={selectedLocation} // Set center based on selected location
                zoom={zoomLevel}
                onClick={debouncedHandleMapClick} // Add onClick event handler to the map
                options={mapOptions} // Set map options
              >
                {t("show-zoom-controls")}
                <MarkerF
                  onDragEnd={(e) => handleMapDrag(e)}
                  position={selectedLocation}
                  draggable={true}
                />
              </GoogleMap>
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              disabled={disableUseLocationBtn}
              sx={{ width: "100%" }}
              color={"primary"}
              variant="solid"
              onClick={() => setOpen(false)}
            >
              {t("use-this-location")}
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default LocationModal;
