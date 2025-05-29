import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/joy";
import SectionHeading from "@/component/SectionHeading/SectionHeading";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];
const MAX_ZOOM_LEVEL = 16;

const GoogleMapRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(5);
  const mapRef = useRef(null);
  const { t } = useTranslation();
  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
  const partners = useSelector((state) => state.homepage?.allRestaurants);

  useEffect(() => {
    if (Array.isArray(partners)) {
      setRestaurants(partners);
    } else {
      setRestaurants([]);
    }
    getCurrentLocation();
  }, [partners]);

  const fitBounds = useCallback(() => {
    handleCloseInfoWindow();

    if (mapRef.current && restaurants.length) {
      const bounds = new window.google.maps.LatLngBounds();
      restaurants.forEach((restaurant) => {
        bounds.extend({
          lat: parseFloat(restaurant.latitude),
          lng: parseFloat(restaurant.longitude),
        });
      });
      mapRef.current.fitBounds(bounds);
      const zoom = mapRef.current.getZoom();
      if (zoom > MAX_ZOOM_LEVEL) {
        mapRef.current.setZoom(MAX_ZOOM_LEVEL);
      }
    }
  }, [restaurants]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
            mapRef.current.setZoom(MAX_ZOOM_LEVEL);
          }
        },
        (error) => {
          toast.error("Unable to retrieve location");
          console.error("Error retrieving location:", error);
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  }, []);

  const handleLoad = (map) => {
    mapRef.current = map;
    fitBounds();
    const controlButton = document.createElement("button");
    controlButton.innerHTML =
      '<span class="material-icons">gps_fixed</span> Current Location';
    controlButton.className = "custom-map-control-button";
    controlButton.addEventListener("click", getCurrentLocation);

    map.controls[window.google?.maps.ControlPosition.TOP_CENTER].push(
      controlButton
    );
  };

  useEffect(() => {
    handleCloseInfoWindow();

    if (mapRef.current && currentLocation) {
      mapRef.current.panTo(currentLocation);
      mapRef.current.setZoom(MAX_ZOOM_LEVEL);
    }
  }, [currentLocation]);

  const handleMarkerHover = (restaurantId) => {
    setHoveredMarker(restaurantId);
  };

  const handleMarkerClick = (restaurantId) => {
    setActiveMarker(restaurantId);
  };

  const handleCloseInfoWindow = () => {
    setActiveMarker(null);
  };

  const handleInfoWindowLoad = (infoWindow) => {
    const closeButton = document.querySelector(".gm-style-iw-d");
    if (closeButton) {
      closeButton.style.display = "none";
    }
  };

  const handleMapClick = (lat, lng) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${Number(
      lat
    )},${Number(lng)}`;
    window.open(url, "_blank");
  };

  const restaurantClick = (slug) => {
    router.push(`/restaurants/${slug}`);
  };

  if (!isLoaded) {
    return <div></div>;
  }

  return (
    <>
      <SectionHeading
        title={t("Explore-Our-Restaurants")}
        highlightText={t("Restaurants")}
        showMore={false}
        subtitle={t("Discover-the-vibrant-restaurants-in-your-area")}
        imageId={4}
      />
      <Box
        mt={2}
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{ width: "100%", height: "600px", position: "relative" }}
          mb={4}
          mt={1}
        >
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            zoom={mapZoom}
            onLoad={handleLoad}
            options={{
              streetViewControl: false,
              zoomControl: true,
            }}
            center={currentLocation || { lat: 0, lng: 0 }}
            onZoomChanged={() => {
              if (mapRef.current) {
                const newZoom = mapRef.current.getZoom();
                setMapZoom(newZoom);
              }
            }}
          >
            {restaurants.map((restaurant) => (
              <Marker
                key={restaurant.partner_id}
                position={{
                  lat: parseFloat(restaurant.latitude),
                  lng: parseFloat(restaurant.longitude),
                }}
                title={restaurant.partner_name}
                icon={{
                  url: "/assets/images/restro-building.png",
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={() => handleMarkerClick(restaurant.partner_id)}
                onMouseOver={() => handleMarkerHover(restaurant.partner_id)}
                onMouseOut={() => {
                  setTimeout(() => {
                    setHoveredMarker(null);
                  }, 4000);
                }}
              >
                {(hoveredMarker === restaurant.partner_id ||
                  activeMarker === restaurant.partner_id) && (
                  <InfoWindow
                    onLoad={handleInfoWindowLoad}
                    onCloseClick={handleCloseInfoWindow}
                  >
                    <Box
                      component={"div"}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box
                        component={"img"}
                        src={restaurant.partner_profile}
                        width={"100%"}
                        height={80}
                        sx={{ objectFit: "cover", borderRadius: "xl" }}
                      />
                      <Typography
                        onClick={() => {
                          restaurantClick(restaurant.slug);
                        }}
                        sx={{
                          fontWeight: "bold",
                          fontSize: "xs",
                          cursor: "pointer",
                        }}
                        endDecorator={
                          <Box
                            component="img"
                            src="/assets/images/google-map-pin.svg"
                            alt="Google Map Icon"
                            width={24}
                            height={24}
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              handleMapClick(
                                restaurant.latitude,
                                restaurant.longitude
                              )
                            }
                          />
                        }
                      >
                        {restaurant.partner_name}
                      </Typography>
                    </Box>
                  </InfoWindow>
                )}
              </Marker>
            ))}
            {currentLocation && (
              <Box
                sx={{
                  position: "absolute",
                  transform: "translate(-50%, -100%)",
                }}
              >
                <Marker
                  position={currentLocation}
                  icon={{
                    url: "/assets/images/standing-human-3d.png",
                    scaledSize: new window.google.maps.Size(100, 100),
                    anchor: new window.google.maps.Point(50, 100), // Center bottom of the image
                  }}
                />
                <OverlayView
                  position={currentLocation}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  getPixelPositionOffset={(width, height) => ({
                    x: -width - 50,
                    y: -height - 140,
                  })}
                >
                  <Box
                    sx={{
                      backgroundColor: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                      display: "inline-block",
                      minWidth: "max-content",
                      position: "relative",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        bottom: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        borderWidth: "12px 8px 0 12px",
                        borderStyle: "solid",
                        borderColor:
                          "white transparent transparent transparent",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
                    >
                      You are here!
                    </Typography>
                  </Box>
                </OverlayView>
              </Box>
            )}
          </GoogleMap>
        </Box>
      </Box>
    </>
  );
};

export default GoogleMapRestaurants;
