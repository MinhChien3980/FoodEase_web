"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  TextField,
  IconButton,
  SearchIcon,
  Input,
  InputAdornment,
  CardCover,
  Avatar,
  Grid,
  Typography,
  Button,
  useTheme,
  CircularProgress,
  useColorScheme,
  ListItem,
  List,
  Chip,
  LinearProgress,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { useJsApiLoader } from "@react-google-maps/api";
import { setAddress as setNewAddress } from "@/store/reducers/selectedMapAddressSlice";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import toast from "react-hot-toast";
import { get_cities, is_city_deliverable } from "@/interceptor/api";
import { useRouter } from "next/router";
import ErestroApp from "./ErestroApp";
import { RiBuilding4Fill, RiGpsFill, RiMapPin2Line } from "@remixicon/react";
import { useTranslation } from "react-i18next";
import { onCityChange } from "@/events/events";
import DarkModeToggle from "@/component/ToggleComponents/DarkModeToggle";
import DownloadApp from "../views/DownloadApp";
import { HeadTitle } from "@/component/HeadTitle";

const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];

const CoverPage = () => {
  const theme = useTheme();

  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const [location, setLocation] = useState(null);
  const [logoSource, setLogoSource] = useState();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
  const settings = useSelector((state) => state.settings.value);
  const [setting, setSettings] = React.useState(false);
  const [cities, setCities] = React.useState([]);
  const { mode } = useColorScheme();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await get_cities();
        if (res?.error) {
          setCities([]);
        } else {
          setCities(res.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (settings && Array.isArray(settings.web_settings) && settings.web_settings.length !== 0)
      setSettings(settings.web_settings[0]);
  }, [settings]);

  useEffect(() => {
    const handleLogoSource = () => {
      if (
        settings &&
        Array.isArray(settings.web_settings) &&
        settings.web_settings.length > 0
      ) {
        if (mode === "light") {
          setLogoSource(settings.web_settings[0].light_logo);
        } else {
          setLogoSource(settings.web_settings[0].logo);
        }
      } else {
        setLogoSource(undefined);
      }
    };
    handleLogoSource();
  }, [mode, settings]);

  const appStoreUrl =
    settings &&
    Array.isArray(settings.web_settings) &&
    settings.web_settings.length > 0
      ? settings.web_settings[0].app_download_section_appstore_url
      : "";

  const playStoreUrl =
    settings &&
    Array.isArray(settings.web_settings) &&
    settings.web_settings.length > 0
      ? settings.web_settings[0].app_download_section_playstore_url
      : "";

  // Check if both URLs are empty
  if (!appStoreUrl && !playStoreUrl) {
    return null;
  }

  if (!isLoaded) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box textAlign="center">
          <CircularProgress />
          <Typography level="body2" mt={2}>
            {t("loading")}...
          </Typography>
        </Box>
      </Box>
    );
  }

  const handleChange = (value) => {
    setAddress(value);
  };

  const handleSelect = async (value) => {
    if (value == "") {
      toast.error("Please Select Location First");
      return;
    }
    setAddress(value); // Dispatching the setAddress action with the selected value

    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);

      const city = results[0].address_components.find((component) =>
        component.types.includes("locality")
      );
      const addressComponents = results[0].address_components;
      const getAddressComponent = (type) =>
        addressComponents.find((component) => component.types.includes(type));
      const state = getAddressComponent(
        "administrative_area_level_1"
      )?.long_name;
      const country = getAddressComponent("country")?.long_name;
      const postalCode = getAddressComponent("postal_code")?.long_name;

      if (city.long_name) {
        let City = city.long_name;
        try {
          const { lat, lng } = latLng;

          const delivery = await is_city_deliverable(City)
            .then((response) => {
              if (response.city_id != null) {
                let city_id = response.city_id;
                onCityChange({ city_id });
              } else {
                toast.error(response.message);
              }
            })
            .catch((error) => {
              console.log(error);
            });

          // Assuming you have another action creator named setNewAddress from another slice
          dispatch(
            setNewAddress({
              city: city.long_name,
              lat: lat,
              lng: lng,
              state,
              country,
              postalCode,
            })
          );

          if (delivery.error) {
            // return toast.error(delivery.message);
          } else {
            await router.push("/home");
          }
        } catch (error) {
          // return toast.error(error.message);
        }
      } else {
        // return toast.error("Please Select City");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // Function to fetch address from coordinates using a geocoding service (example)
  const fetchAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Make a request to a geocoding service API with latitude and longitude
      const response = await fetch(
        `https://geocoding-service.com?lat=${latitude}&lon=${longitude}`
      );
      // Parse the response as JSON
      const data = await response.json();
      // Extract address information from the response
      const address = data.address;
      // Set the retrieved address in your component state or update it as needed
      setAddress(address);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Do something with the latitude and longitude values
          try {
            const results = await geocodeByAddress(`${latitude},${longitude}`);
            if (results && results.length > 0) {
              const address = results[0].formatted_address;

              // You can extract city name or other relevant information from the address
              const city = results[0].address_components.find((component) =>
                component.types.includes("locality")
              );

              setAddress(address);
              const addressComponents = results[0].address_components;
              const getAddressComponent = (type) =>
                addressComponents.find((component) =>
                  component.types.includes(type)
                );
              const state = getAddressComponent(
                "administrative_area_level_1"
              )?.long_name;
              const country = getAddressComponent("country")?.long_name;
              const postalCode = getAddressComponent("postal_code")?.long_name;

              if (city) {
                let delivery;
                let City = city.long_name;
                try {
                  const delivery = await is_city_deliverable(City)
                    .then((response) => {
                      if (response.city_id != null) {
                        let city_id = response.city_id;
                        onCityChange({ city_id });
                      } else {
                        toast.error(response.message);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
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
                  if (delivery.error) {
                    // return toast.error(delivery.message)
                  } else {
                    await router.push("/home");
                    // return toast.success(delivery.message)
                  }
                } catch (error) {
                  // return toast.error(error.message)
                }
              } else {
                // return toast.error("Please Select City")
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

  const handleCityClick = (city) => {
    setAddress(city.name);
    dispatch(
      setNewAddress({
        city: city.name,
        lat: parseFloat(city?.latitude || process.env.NEXT_PUBLIC_LATITUDE),
        lng: parseFloat(city?.longitude || process.env.NEXT_PUBLIC_LONGITUDE),
      })
    );
    onCityChange({ city_id: city.id });
    router.push("/home");
    toast.success(t("citySelected", { cityName: city.name }));
  };

  return (
    <>
      <HeadTitle title={"Welcome"} />
      <Box display="flex" position="relative" flexDirection="column">
        {/* Navbar */}
        <Box
          display="flex"
          gap={1}
          py={2}
          justifyContent="space-between"
          alignItems="center"
          bgcolor={theme.palette.primary.main}
          color={theme.palette.primary.contrastText}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              maxWidth: "100%",
              height: "52px",
            }}
          >
            {setting && (
              <Box
                className="min-size-100  object-fit"
                component={"img"}
                src={logoSource}
                alt="eRestro Logo"
                width={"100%"}
                height={"100%"}
              />
            )}
          </Box>
          <Box>
            <DarkModeToggle />
          </Box>
        </Box>

        {/* Hero Section */}
        <Box flex="1" my={4}>
          <Grid container justifyContent="center">
            <Grid xs={12} md={6}>
              <Box sx={{ my: { md: 16, xs: 1 } }}>
                <Typography
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "2.0rem", md: "2.5rem" },
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  {setting && setting?.landing_page_main_title}
                  <span color={theme.palette.primary[500]}>{t("menu")}!</span>
                </Typography>

                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontSize: "1.2rem",
                    fontWeight: "400",
                    color: theme.palette.text.description,
                    mb: 2,
                  }}
                >
                  {setting && setting?.landing_page_description}
                </Typography>
                <Box sx={{ mb: 2, maxWidth: { md: "80%", xs: "100%" } }}>
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
                      <Box sx={{ position: "relative" }}>
                        <Input
                          {...getInputProps({
                            placeholder: t("type_to_choose_a_location"),
                            startDecorator: <RiBuilding4Fill />,
                            endDecorator: (
                              <Box display="flex" alignItems="center" gap={1}>
                                <IconButton
                                  onClick={() => handleGPS()}
                                  title={t("click_fetch_current_city")}
                                >
                                  <RiGpsFill />
                                </IconButton>
                                <Button
                                  onClick={() => handleSelect(address)}
                                  title={t("search")}
                                >
                                  {t("search")}
                                </Button>
                              </Box>
                            ),
                            sx: { "--Input-minHeight": "50px" },
                          })}
                        />
                        <Box
                          className="autocomplete-dropdown-container"
                          sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            zIndex: 999, // Ensure the suggestion box is above the cities
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "4px",
                            minWidth: "100%",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          {loading && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                padding: 2,
                                backgroundColor: "InactiveCaption",
                              }}
                            >
                              <LinearProgress color="primary" variant="plain" />
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
                                  color: theme.palette.text.primary,
                                }
                              : {
                                  backgroundColor:
                                    theme.palette.background.body,
                                  cursor: "pointer",
                                  padding: 4,
                                  paddingLeft: 16,
                                  border: 1,
                                  color: theme.palette.text.primary,
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
                      </Box>
                    )}
                  </PlacesAutocomplete>

                  <Box sx={{ position: "relative" }}>
                    <Box sx={{ position: "absolute", zIndex: 99 }}>
                      {cities.length > 0 && (
                        <Box
                          sx={{
                            zIndex: 10,
                            borderRadius: "4px",
                            padding: "8px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1.5,
                            marginTop: 1,
                            maxHeight: "calc(2 * 96px)",
                            overflowY: "auto",
                          }}
                        >
                          {cities.map((city) => (
                            <Chip
                              title={t("clickToSelectCity", {
                                cityName: city.name,
                              })}
                              key={city.id}
                              startDecorator={<RiMapPin2Line size={16} />}
                              onClick={() => handleCityClick(city)}
                              sx={{
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                                },
                                padding: 1,
                                paddingRight: 1.5,
                              }}
                              variant="soft" // MUI Joy Chip variant (customizable)
                            >
                              {city.name}
                            </Chip>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <Grid xs={12} md={6}>
              <Card
                sx={{
                  maxWidth: "100%",
                  height: { xs: "350px", md: "500px" },
                  border: 0,
                  backgroundColor: "transparent",
                }}
              >
                <CardCover>
                  <Box
                    component="img"
                    src={
                      setting?.landing_page_main_image ||
                      "/assets/coverpage/index.jpg"
                    }
                    alt="Hero Image"
                    className="object-fit height100 width100"
                  />
                </CardCover>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Box
        sx={{
          py: 6,
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-115px",
            left: "-650px",
            width: "100%",
            height: "70%",
            [theme.breakpoints.down("md")]: {
              top: "-14%",
              left: "-3%",
              width: "21%",
              height: "41%",
            },
            [theme.breakpoints.down("sm")]: {
              top: "-92px",
              left: "-8px",
              width: "45%",
              height: "21%",
            },
          }}
        >
          <Box
            component={"img"}
            src="./assets/coverpage/food-items-hero.svg"
            alt="hero logo"
            className="height100 width100"
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: "-65px",
            left: "88%",
            width: "20%",
            height: "40%",
            [theme.breakpoints.down("lg")]: {
              top: "-11%",
              left: "90%",
              width: "12%",
              zIndex: -99999,
              height: "39%",
            },
            [theme.breakpoints.down("md")]: {
              top: "33%",
              left: "90%",
              width: "14%",
              height: "27%",
            },
            [theme.breakpoints.down("sm")]: {
              top: "-20px",
              left: "-120px",
              width: "150%",
              height: "auto",
            },
          }}
        >
          <Box
            component={"img"}
            src="./assets/coverpage/garlic-cover-page.svg"
            alt="image"
            className="postion-absolute height100 width100"
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: "-35px",
            left: "430px",
            width: "40%",
            zIndex: -99999,
            height: "20%",
            [theme.breakpoints.down("md")]: {
              top: "41%",
              left: "-13%",
              width: "50%",
              zIndex: -99999,
              height: "10%",
            },
            [theme.breakpoints.down("sm")]: {
              top: "447px",
              left: "41px",
              width: "13%",
              zIndex: -99999,
              height: "auto",
            },

            [theme.breakpoints.down("xs")]: {
              top: "409px",
              left: "41px",
              width: "13%",
              zIndex: -99999,
              height: "auto",
            },
          }}
        >
          <Box
            component={"img"}
            src="./assets/coverpage/plant-cover.svg"
            alt="Your image"
            className="width100 height100"
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: "339px",
            left: "-690px",
            width: "100%",
            height: "30%",
            zIndex: -99999,

            [theme.breakpoints.down("md")]: {
              top: "85%",
              left: "-6%",
              width: "11%",
              height: "19%",
              zIndex: -99999,
            },
            [theme.breakpoints.down("sm")]: {
              top: "912px",
              left: "-57px",
              width: "35%",
              height: "auto",
              zIndex: -99999,
            },
          }}
        ></Box>

        <Grid container spacing={4}>
          <Grid xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // Add this line
                height: "100%", // Ensure the container takes the full height of its parent
                paddingY: 3,
              }}
            >
              <Typography
                level="h4"
                sx={{ mb: 2, color: theme.palette.primary[600] }}
              >
                {t("ourStoryAndServices")}
              </Typography>

              <Typography
                variant="h1"
                gutterBottom
                sx={{
                  fontSize: { xs: "2.0rem", md: "2.5rem" },
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  color: theme.palette.text.primary[50],
                  mb: 4,
                }}
              >
                {setting && setting?.story_section_tile}
              </Typography>

              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontSize: "1.2rem",
                  fontWeight: "400",
                  color: theme.palette.text.description,
                  mb: 4,
                }}
              >
                {setting && setting?.story_section_description}
              </Typography>
            </Box>
          </Grid>

          <Grid xs={12} md={6} sm={12}>
            <Grid
              container
              spacing={2}
              columns={{ xs: 8, sm: 16, md: 16, lg: 16 }} // Adjusting number of columns for different screen sizes
              sx={{ flexGrow: 1 }}
            >
              <Grid xs={16} sm={8} md={8}>
                <Box sx={{ Height: "100%" }}>
                  {" "}
                  <Card
                    variant="solid"
                    sx={{
                      height: "100%", // Ensure consistent card height

                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      padding: 1.5,
                      backgroundColor: theme.palette.background.surface,
                      borderRadius: 8, // Border radius
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                      // Set max height
                      overflow: "auto", // Enable overflow scrolling if content exceeds max height
                    }}
                  >
                    <svg
                      width="54"
                      height="54"
                      viewBox="0 0 64 64"
                      fill={theme.palette.text.primary}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1214_13845)">
                        <path
                          d="M61.8505 30.934C60.4336 29.0419 58.4203 27.6825 56.1358 27.0754C57.2493 23.8385 58.0721 20.5089 58.5944 17.126C58.7651 15.8963 58.648 14.6438 58.2524 13.4671C57.8568 12.2903 57.1934 11.2215 56.3145 10.3446C55.4356 9.46781 54.3652 8.80696 53.1875 8.41411C52.0099 8.02125 50.7571 7.90712 49.5278 8.0807C49.1918 8.12603 48.1945 8.2727 46.8318 8.5367C47.6756 6.66858 48.0753 4.63047 47.9998 2.58203C47.9886 2.23184 47.9085 1.88729 47.7641 1.56804C47.6198 1.24879 47.4139 0.961108 47.1584 0.721409C46.9028 0.48171 46.6026 0.294692 46.2748 0.171032C45.9469 0.047373 45.598 -0.0105059 45.2478 0.000700194C44.8976 0.0119063 44.553 0.0919781 44.2338 0.236344C43.9145 0.380709 43.6269 0.586542 43.3872 0.842089C43.1475 1.09764 42.9604 1.39789 42.8368 1.72572C42.7131 2.05354 42.6552 2.40251 42.6664 2.7527C42.7119 4.04088 42.4476 5.32116 41.8958 6.48603C41.5101 5.44512 40.96 4.47277 40.2664 3.60603C39.0876 2.26443 37.5912 1.23977 35.9142 0.625776C34.2371 0.0117815 32.4329 -0.171956 30.6664 0.0913669C28.7296 0.246836 26.8783 0.95589 25.3331 2.13403C23.5863 0.819883 21.473 0.0834472 19.2878 0.0273669C16.5149 -0.241379 13.7486 0.599553 11.5944 2.36603C10.5007 3.33982 9.61754 4.52699 8.99937 5.85458C8.3812 7.18218 8.04103 8.62216 7.99978 10.086C7.9266 12.4301 8.60907 14.7355 9.94644 16.662C8.31951 18.057 7.0566 19.827 6.26677 21.8192C5.47695 23.8114 5.18396 25.9659 5.41311 28.0967C3.30419 29.2719 1.66069 31.1331 0.755533 33.3713C-0.149626 35.6094 -0.261986 38.0899 0.437109 40.4007C2.2638 46.7567 5.66372 52.5495 10.3224 57.2434C14.7918 61.6013 20.7948 64.0282 27.0371 64.0007H36.9624C43.204 64.0287 49.2064 61.6017 53.6744 57.2434C58.3349 52.5504 61.7358 46.7574 63.5625 40.4007C64.0385 38.799 64.1317 37.1077 63.8343 35.4634C63.5369 33.8191 62.8574 32.2676 61.8505 30.934ZM50.2691 13.3607C50.6818 13.305 51.1018 13.3455 51.4962 13.479C51.8907 13.6125 52.2489 13.8353 52.543 14.1302C52.837 14.425 53.059 14.7838 53.1914 15.1786C53.3238 15.5734 53.3632 15.9935 53.3064 16.406C52.7472 19.9079 51.8405 23.3453 50.5998 26.6674H43.7704L47.2184 23.2194C47.7042 22.7164 47.973 22.0428 47.9669 21.3436C47.9608 20.6444 47.6804 19.9756 47.186 19.4812C46.6915 18.9868 46.0227 18.7063 45.3235 18.7002C44.6243 18.6942 43.9507 18.9629 43.4478 19.4487L36.2291 26.6674H32.0984C31.9037 25.2648 32.0374 23.8362 32.4891 22.4942C32.9407 21.1522 33.698 19.9334 34.7011 18.934C35.8398 17.7847 40.2051 14.6674 50.2691 13.3607ZM13.3331 10.2647C13.3491 9.53056 13.5147 8.80739 13.8196 8.13937C14.1245 7.47134 14.5623 6.87248 15.1064 6.37937C16.2066 5.56615 17.5734 5.19851 18.9331 5.35003C19.5899 5.32303 20.2449 5.43523 20.8552 5.67927C21.4656 5.92331 22.0174 6.29367 22.4744 6.76603C22.8343 7.16807 23.2749 7.48965 23.7675 7.70976C24.2601 7.92987 24.7936 8.04355 25.3331 8.04337C25.8714 8.04071 26.4031 7.92491 26.8938 7.70347C27.3844 7.48204 27.823 7.15993 28.1811 6.75803C28.5788 6.33732 29.0561 5.99976 29.5853 5.76493C30.1144 5.53009 30.685 5.40267 31.2638 5.39003C32.1452 5.23302 33.0519 5.29699 33.9026 5.57621C34.7533 5.85543 35.5215 6.34119 36.1384 6.99003C36.948 8.02642 37.3705 9.31281 37.3331 10.6274C37.3331 10.8007 37.3331 11.1794 37.3331 11.1794C33.7931 12.4541 30.7691 14.8551 28.7251 18.014C27.0412 16.0206 24.8008 14.5751 22.2905 13.8625C19.7803 13.1499 17.1145 13.2027 14.6344 14.014C13.7495 12.9696 13.2855 11.6328 13.3331 10.2647ZM10.6664 26.6674C10.6664 24.5456 11.5093 22.5108 13.0096 21.0105C14.5099 19.5102 16.5447 18.6674 18.6664 18.6674C20.7882 18.6674 22.823 19.5102 24.3233 21.0105C25.8236 22.5108 26.6664 24.5456 26.6664 26.6674H10.6664ZM58.4425 38.9047C56.8491 44.3905 53.9167 49.3939 49.9091 53.4647C46.444 56.8314 41.7937 58.7001 36.9624 58.6674H27.0371C22.2045 58.699 17.553 56.8305 14.0851 53.4647C10.0773 49.3941 7.14489 44.3905 5.55178 38.9047C5.31271 38.0973 5.26634 37.2452 5.4164 36.4166C5.56645 35.5881 5.90874 34.8063 6.41578 34.134C6.90775 33.4704 7.54871 32.9316 8.28702 32.5611C9.02534 32.1906 9.84036 31.9986 10.6664 32.0007H53.3331C54.1619 31.9961 54.9801 32.1868 55.7214 32.5575C56.4627 32.9281 57.1062 33.4682 57.5998 34.134C58.1032 34.8081 58.4417 35.5908 58.588 36.4192C58.7343 37.2477 58.6845 38.099 58.4425 38.9047Z"
                          fill={theme.palette.text.primary}
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1214_13845">
                          <rect width="64" height="64" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <Typography
                      level="h2"
                      component="div"
                      sx={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {t("freshMeals")}
                    </Typography>

                    <Typography
                      level="body2"
                      sx={{
                        fontSize: 19,
                        fontWeight: 400,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {t("delightGuests")}
                    </Typography>
                  </Card>
                </Box>
              </Grid>
              <Grid xs={16} sm={8} md={8}>
                <Card
                  variant="solid"
                  sx={{
                    height: "100%", // Ensure consistent card height

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: 1.5,
                    backgroundColor: theme.palette.background.surface,
                    borderRadius: 8, // Border radius
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                    maxHeight: "100%", // Set max height
                    overflow: "auto", // Enable overflow scrolling if content exceeds max height
                  }}
                >
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 64 64"
                    fill={theme.palette.text.primary}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1214_13844)">
                      <path
                        d="M24 63.9983H2.66667C1.95942 63.9983 1.28115 63.7174 0.781049 63.2173C0.280952 62.7172 0 62.0389 0 61.3317C0 60.6244 0.280952 59.9462 0.781049 59.4461C1.28115 58.946 1.95942 58.665 2.66667 58.665H24C24.7072 58.665 25.3855 58.946 25.8856 59.4461C26.3857 59.9462 26.6667 60.6244 26.6667 61.3317C26.6667 62.0389 26.3857 62.7172 25.8856 63.2173C25.3855 63.7174 24.7072 63.9983 24 63.9983Z"
                        fill={theme.palette.text.primary}
                      />
                      <path
                        d="M18.6667 53.3334H2.66667C1.95942 53.3334 1.28115 53.0524 0.781049 52.5523C0.280952 52.0522 0 51.3739 0 50.6667C0 49.9594 0.280952 49.2812 0.781049 48.7811C1.28115 48.281 1.95942 48 2.66667 48H18.6667C19.3739 48 20.0522 48.281 20.5523 48.7811C21.0524 49.2812 21.3333 49.9594 21.3333 50.6667C21.3333 51.3739 21.0524 52.0522 20.5523 52.5523C20.0522 53.0524 19.3739 53.3334 18.6667 53.3334Z"
                        fill={theme.palette.text.primary}
                      />
                      <path
                        d="M13.3333 42.6683H2.66667C1.95942 42.6683 1.28115 42.3874 0.781049 41.8873C0.280952 41.3872 0 40.7089 0 40.0016C0 39.2944 0.280952 38.6161 0.781049 38.116C1.28115 37.6159 1.95942 37.335 2.66667 37.335H13.3333C14.0406 37.335 14.7189 37.6159 15.219 38.116C15.719 38.6161 16 39.2944 16 40.0016C16 40.7089 15.719 41.3872 15.219 41.8873C14.7189 42.3874 14.0406 42.6683 13.3333 42.6683Z"
                        fill={theme.palette.text.primary}
                      />
                      <path
                        d="M34.6669 63.8788C33.9597 63.9103 33.2689 63.6595 32.7465 63.1817C32.2242 62.7039 31.913 62.0381 31.8816 61.3308C31.8501 60.6236 32.1009 59.9328 32.5787 59.4105C33.0566 58.8881 33.7223 58.577 34.4296 58.5455C39.4761 58.0838 44.2866 56.1936 48.2976 53.0964C52.3087 49.9992 55.3541 45.8232 57.0773 41.0576C58.8005 36.2919 59.1301 31.1339 58.0275 26.1877C56.9249 21.2414 54.4358 16.7118 50.8516 13.1292C47.2674 9.54671 42.7366 7.05963 37.7899 5.95929C32.8431 4.85896 27.6853 5.19093 22.9204 6.91633C18.1556 8.64174 13.981 11.6891 10.8857 15.7016C7.79032 19.714 5.90237 24.5254 5.44294 29.5722C5.37929 30.2766 5.03842 30.9269 4.49531 31.3799C3.95221 31.833 3.25136 32.0518 2.54694 31.9882C1.84253 31.9245 1.19225 31.5836 0.739164 31.0405C0.286077 30.4974 0.067294 29.7966 0.130946 29.0922C0.874649 20.8877 4.75388 13.286 10.9611 7.86968C17.1684 2.45332 25.2254 -0.360454 33.455 0.0140732C41.6847 0.3886 49.4528 3.92257 55.1424 9.88035C60.8321 15.8381 64.0048 23.7607 64.0002 31.9988C64.0411 39.9944 61.0707 47.7124 55.6799 53.6175C50.2892 59.5227 42.8731 63.1822 34.9069 63.8682C34.8269 63.8762 34.7442 63.8788 34.6669 63.8788Z"
                        fill={theme.palette.text.primary}
                      />
                      <path
                        d="M32.0007 16C31.2934 16 30.6151 16.281 30.115 16.781C29.6149 17.2811 29.334 17.9594 29.334 18.6667V32C29.3341 32.7072 29.6152 33.3854 30.1153 33.8853L38.1153 41.8853C38.6183 42.3711 39.2919 42.6399 39.9911 42.6338C40.6902 42.6277 41.3591 42.3473 41.8535 41.8528C42.3479 41.3584 42.6284 40.6896 42.6344 39.9904C42.6405 39.2912 42.3717 38.6176 41.886 38.1147L34.6673 30.896V18.6667C34.6673 17.9594 34.3864 17.2811 33.8863 16.781C33.3862 16.281 32.7079 16 32.0007 16Z"
                        fill={theme.palette.text.primary}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1214_13844">
                        <rect width="64" height="64" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <Typography
                    level="h6"
                    component="div"
                    sx={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("fastDelivery")}
                  </Typography>

                  <Typography
                    level="body2"
                    sx={{
                      fontSize: 19,
                      fontWeight: 400,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("promptDelivery")}
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              columns={{ xs: 8, sm: 16, md: 16, lg: 16 }}
              sx={{ flexGrow: 1 }}
            >
              <Grid xs={16} sm={8} md={8}>
                <Card
                  variant="solid"
                  sx={{
                    height: "100%", // Ensure consistent card height

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: 1.5,
                    backgroundColor: theme.palette.background.surface,
                    borderRadius: 8, // Border radius
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                    maxHeight: "400px", // Set max height
                    overflow: "auto", // Enable overflow scrolling if content exceeds max height
                  }}
                >
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 64 64"
                    fill={theme.palette.text.primary}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1214_13847)">
                      <path
                        d="M18.6663 64.0016C21.6118 64.0016 23.9997 61.6138 23.9997 58.6683C23.9997 55.7228 21.6118 53.335 18.6663 53.335C15.7208 53.335 13.333 55.7228 13.333 58.6683C13.333 61.6138 15.7208 64.0016 18.6663 64.0016Z"
                        fill={theme.palette.text.primary}
                      />
                      <path
                        d="M45.3333 64.0016C48.2788 64.0016 50.6666 61.6138 50.6666 58.6683C50.6666 55.7228 48.2788 53.335 45.3333 53.335C42.3878 53.335 40 55.7228 40 58.6683C40 61.6138 42.3878 64.0016 45.3333 64.0016Z"
                        fill={theme.palette.text.primary}
                      />
                      <path
                        d="M63.1597 3.56104C62.6596 3.06111 61.9815 2.78027 61.2744 2.78027C60.5673 2.78027 59.8891 3.06111 59.389 3.56104L45.6317 17.3317L41.4957 13.0144C41.253 12.7619 40.963 12.5597 40.6422 12.4193C40.3213 12.2789 39.976 12.203 39.6258 12.1961C39.2757 12.1892 38.9276 12.2513 38.6015 12.3789C38.2753 12.5064 37.9775 12.697 37.725 12.9397C37.4726 13.1824 37.2703 13.4724 37.1299 13.7933C36.9895 14.1141 36.9137 14.4594 36.9068 14.8096C36.8928 15.5167 37.1603 16.2004 37.6504 16.7104L41.9544 21.1877C42.413 21.683 42.9673 22.0802 43.5837 22.3552C44.2002 22.6302 44.8661 22.7774 45.541 22.7877H45.629C46.2905 22.7899 46.9458 22.6607 47.557 22.4075C48.1681 22.1544 48.7229 21.7823 49.189 21.313L63.1597 7.3317C63.6596 6.83163 63.9405 6.15348 63.9405 5.44637C63.9405 4.73927 63.6596 4.06111 63.1597 3.56104Z"
                        fill={theme.palette.text.primary}
                      />
                      <path
                        d="M58.4 24.0427C58.0552 23.9804 57.7015 23.9866 57.3592 24.0611C57.0168 24.1355 56.6925 24.2767 56.4047 24.4766C56.117 24.6764 55.8714 24.931 55.6821 25.2258C55.4927 25.5206 55.3634 25.8498 55.3013 26.1947L54.96 28.0853C54.6273 29.9315 53.6565 31.6021 52.2171 32.8051C50.7776 34.0081 48.9613 34.667 47.0853 34.6667H14.448L11.9413 13.3333H29.3333C30.0406 13.3333 30.7189 13.0524 31.2189 12.5523C31.719 12.0522 32 11.3739 32 10.6667C32 9.95942 31.719 9.28115 31.2189 8.78105C30.7189 8.28095 30.0406 8 29.3333 8H11.312L11.2 7.06133C10.9702 5.11626 10.0348 3.32308 8.57117 2.02161C7.10751 0.720145 5.21727 0.000834231 3.25867 0L2.66667 0C1.95942 0 1.28115 0.280952 0.781049 0.781049C0.280952 1.28115 0 1.95942 0 2.66667C0 3.37391 0.280952 4.05219 0.781049 4.55229C1.28115 5.05238 1.95942 5.33333 2.66667 5.33333H3.25867C3.91182 5.33342 4.54223 5.57322 5.03033 6.00724C5.51842 6.44127 5.83025 7.03933 5.90667 7.688L9.576 38.888C9.95694 42.1328 11.5159 45.1248 13.9571 47.296C16.3982 49.4673 19.5516 50.6667 22.8187 50.6667H50.6667C51.3739 50.6667 52.0522 50.3857 52.5523 49.8856C53.0524 49.3855 53.3333 48.7072 53.3333 48C53.3333 47.2928 53.0524 46.6145 52.5523 46.1144C52.0522 45.6143 51.3739 45.3333 50.6667 45.3333H22.8187C21.164 45.3337 19.55 44.8209 18.199 43.8657C16.8479 42.9106 15.8262 41.56 15.2747 40H47.0853C50.2114 40.0002 53.2382 38.902 55.6369 36.8972C58.0355 34.8924 59.6534 32.1085 60.208 29.032L60.5493 27.1387C60.6744 26.4431 60.5183 25.7264 60.1153 25.1459C59.7123 24.5654 59.0954 24.1686 58.4 24.0427Z"
                        fill={theme.palette.text.primary}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1214_13847">
                        <rect width="64" height="64" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <Typography
                    level="h6"
                    component="div"
                    sx={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("Online-Ordering")}
                  </Typography>

                  <Typography
                    level="body2"
                    sx={{
                      fontSize: 19,
                      fontWeight: 400,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("exploreMenu")}
                  </Typography>
                </Card>
              </Grid>
              <Grid xs={16} sm={8} md={8}>
                <Card
                  variant="solid"
                  sx={{
                    height: "100%", // Ensure consistent card height

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: 1.5,
                    backgroundColor: theme.palette.background.surface,
                    borderRadius: 8, // Border radius
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
                    maxHeight: "400px", // Set max height
                    overflow: "auto", // Enable overflow scrolling if content exceeds max height
                  }}
                >
                  <svg
                    width="54"
                    height="54"
                    viewBox="0 0 64 64"
                    fill={theme.palette.text.primary}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1214_13846)">
                      <path
                        d="M53.3333 18.6667H48.6987C50.2064 17.3376 51.4032 15.693 52.2042 13.8496C53.0051 12.0062 53.3906 10.0091 53.3333 8C53.3333 7.29276 53.0524 6.61448 52.5523 6.11438C52.0522 5.61428 51.3739 5.33333 50.6667 5.33333C49.9594 5.33333 49.2811 5.61428 48.781 6.11438C48.281 6.61448 48 7.29276 48 8C48 14.992 41.6773 17.4133 36.8693 18.2427C38.644 15.0961 39.7122 11.601 40 8C40 5.87827 39.1571 3.84344 37.6569 2.34315C36.1566 0.842855 34.1217 0 32 0C29.8783 0 27.8434 0.842855 26.3431 2.34315C24.8429 3.84344 24 5.87827 24 8C24.2878 11.601 25.356 15.0961 27.1307 18.2427C22.3227 17.4133 16 14.992 16 8C16 7.29276 15.719 6.61448 15.219 6.11438C14.7189 5.61428 14.0406 5.33333 13.3333 5.33333C12.6261 5.33333 11.9478 5.61428 11.4477 6.11438C10.9476 6.61448 10.6667 7.29276 10.6667 8C10.6094 10.0091 10.9949 12.0062 11.7958 13.8496C12.5968 15.693 13.7936 17.3376 15.3013 18.6667H10.6667C7.83769 18.6667 5.12458 19.7905 3.12419 21.7909C1.12381 23.7912 0 26.5044 0 29.3333L0 32C0 33.4145 0.561903 34.771 1.5621 35.7712C2.56229 36.7714 3.91885 37.3333 5.33333 37.3333V50.6667C5.33757 54.2016 6.74369 57.5905 9.24325 60.0901C11.7428 62.5897 15.1317 63.9958 18.6667 64H45.3333C48.8683 63.9958 52.2572 62.5897 54.7568 60.0901C57.2563 57.5905 58.6624 54.2016 58.6667 50.6667V37.3333C60.0812 37.3333 61.4377 36.7714 62.4379 35.7712C63.4381 34.771 64 33.4145 64 32V29.3333C64 26.5044 62.8762 23.7912 60.8758 21.7909C58.8754 19.7905 56.1623 18.6667 53.3333 18.6667ZM32 5.33333C32.7072 5.33333 33.3855 5.61428 33.8856 6.11438C34.3857 6.61448 34.6667 7.29276 34.6667 8C34.3448 10.8342 33.4366 13.5704 32 16.0347C30.5634 13.5704 29.6552 10.8342 29.3333 8C29.3333 7.29276 29.6143 6.61448 30.1144 6.11438C30.6145 5.61428 31.2928 5.33333 32 5.33333ZM5.33333 29.3333C5.33333 27.9188 5.89524 26.5623 6.89543 25.5621C7.89562 24.5619 9.25218 24 10.6667 24H29.3333V32H5.33333V29.3333ZM10.6667 50.6667V37.3333H29.3333V58.6667H18.6667C16.5449 58.6667 14.5101 57.8238 13.0098 56.3235C11.5095 54.8232 10.6667 52.7884 10.6667 50.6667ZM53.3333 50.6667C53.3333 52.7884 52.4905 54.8232 50.9902 56.3235C49.4899 57.8238 47.4551 58.6667 45.3333 58.6667H34.6667V37.3333H53.3333V50.6667ZM34.6667 32V24H53.3333C54.7478 24 56.1044 24.5619 57.1046 25.5621C58.1048 26.5623 58.6667 27.9188 58.6667 29.3333V32H34.6667Z"
                        fill={theme.palette.text.primary}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1214_13846">
                        <rect width="64" height="64" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <Typography
                    level="h6"
                    component="div"
                    sx={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("gourmetExperience")}
                  </Typography>

                  <Typography
                    level="body2"
                    sx={{
                      fontSize: 19,
                      fontWeight: 400,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {t("premiumFlavors")}
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* <Box width={"100%"} mt={2}>
        <DownloadApp />
      </Box> */}

      <Box
        className="full-width"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.palette.primary[500],
          width: "100%",
          padding: 2,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: theme.palette.common.white }}
          fontWeight={"xl"}
        >
          {settings &&
            settings.web_settings[0].copyright_details.replace(/\\r\\n/g, "")}
        </Typography>
      </Box>
    </>
  );
};

export default CoverPage;
