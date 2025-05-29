import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  OverlayView,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { get_live_tracking_details } from "@/interceptor/api";
import toast from "react-hot-toast";
import { Box, Button, Modal, Typography, IconButton, useTheme } from "@mui/joy";
import { RiCloseLargeFill } from "@remixicon/react";
import { useTranslation } from "react-i18next";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const GOOGLE_MAPS_LIBRARIES = ["places", "geometry"];

const LiveTrackingModal = ({ order_id, order }) => {
  const [open, setOpen] = useState(false);
  const [riderLocation, setRiderLocation] = useState({ lat: null, lng: null });
  const [userLocation, setUserLocation] = useState({
    lat: parseFloat(order.latitude),
    lng: parseFloat(order.longitude),
  });

  const [map, setMap] = useState(null);
  const [riderRotation, setRiderRotation] = useState(0);
  const theme = useTheme();
  const [intervalId, setIntervalId] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const { t } = useTranslation();

  const getRiderPosition = async () => {
    try {
      const response = await get_live_tracking_details(order_id);
      if (response.error) {
        toast.error(response.message);
      } else {
        const newRiderLocation = {
          lat: Number(response.data[0].latitude),
          lng: Number(response.data[0].longitude),
        };
        setRiderLocation(newRiderLocation);
        updateRiderRotation(newRiderLocation);
      }
    } catch (error) {
      toast.error("Error fetching rider location.");
    }
  };

  const updateRiderRotation = (newRiderLocation) => {
    if (userLocation.lat && userLocation.lng) {
      const heading = window.google.maps.geometry.spherical.computeHeading(
        new window.google.maps.LatLng(newRiderLocation),
        new window.google.maps.LatLng(userLocation)
      );
      setRiderRotation(heading);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let interval;

    if (open) {
      interval = setInterval(() => {
        if (open) {
          getRiderPosition();
        }
      }, 15000); // Call getRiderPosition every 15 seconds
    }

    return () => {
      clearInterval(interval); // Clean up the interval on component unmount or when the modal is closed
    };
  }, [open, getRiderPosition]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clean up the interval on component unmount
      }
    };
  }, [intervalId]);

  useEffect(() => {
    if (open) {
      getRiderPosition();
    }
  }, [open]);

  useEffect(() => {
    setUserLocation({
      lat: parseFloat(order.latitude),
      lng: parseFloat(order.longitude),
    });
  }, [order]);

  const onLoad = (map) => {
    setMap(map);
    fitBounds(map);
  };

  const fitBounds = useCallback(
    (map) => {
      if (
        riderLocation.lat &&
        riderLocation.lng &&
        userLocation.lat &&
        userLocation.lng
      ) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(riderLocation);
        bounds.extend(userLocation);
        map.fitBounds(bounds);
      }
    },
    [riderLocation, userLocation]
  );

  useEffect(() => {
    if (map) {
      fitBounds(map);
    }
  }, [map, fitBounds, riderLocation, userLocation]);

  const polylineOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.2,
    strokeWeight: 2,
    icons: [
      {
        icon: {
          path: "M 0,-1 0,1",
          strokeOpacity: 1,
          scale: 4,
        },
        offset: "0",
        repeat: "20px",
      },
    ],
  };
  // const createRiderIcon = useCallback((rotation) => {
  //   const svgMarkup = `
  //     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 37 37" width="37" height="37">
  //       <g transform="rotate(${rotation} 18.5 18.5)">
  //         <circle cx="18.5" cy="18.5" r="18.5" fill="#4285F4" />
  //         <path d="M18.5 7 L25 25 L18.5 21 L12 25 Z" fill="white" />
  //       </g>
  //     </svg>
  //   `;
  //   console.log(
  //     `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarkup)}`
  //   );
  //   return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgMarkup)}`;
  // }, []);
  const [iconUrl, setIconUrl] = useState("");
  const createRiderIcon = useCallback(async (rotation) => {
    const response = await fetch("/assets/images/delivery-rider-2.png");
    const blob = await response.blob();
    const img = new Image();

    img.src = URL.createObjectURL(blob);

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Move the origin to the center of the canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotation >= 0) {
          let newRotation = rotation + 150;
          ctx.scale(1, -1); // Flip vertically on Y-axis
          // Apply rotation (convert degrees to radians)
          ctx.rotate((newRotation * Math.PI) / 180);
        } else {
          let newRotation = rotation + 90;

          ctx.rotate((newRotation * Math.PI) / 180);
        }

        // Draw the image, centered at the new origin
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        resolve(canvas.toDataURL("image/png"));
      };
    });
  }, []);

  useEffect(() => {
    const updateIcon = async () => {
      const url = await createRiderIcon(riderRotation);
      setIconUrl(url);
    };

    updateIcon();
  }, [createRiderIcon, riderRotation]);

  if (!isLoaded) {
    return <div></div>;
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        {t("track-order")}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
            backgroundColor: theme.palette.background.surface,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                fontSize: "xl",
                fontWeight: "xl",
              }}
            >
              {t("order-live-tracking")}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{ color: theme.palette.text.primary }}
            >
              <RiCloseLargeFill />
            </IconButton>
          </Box>
          <Typography
            textAlign={"center"}
            id="modal-description"
            sx={{ my: 2, color: theme.palette.text.primary }}
          >
            {t("tracking-modal-text")}
          </Typography>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: riderLocation.lat || userLocation.lat || 0,
              lng: riderLocation.lng || userLocation.lng || 0,
            }}
            onLoad={onLoad}
          >
            {riderLocation.lat && riderLocation.lng && (
              <>
                <Marker
                  position={{ lat: riderLocation.lat, lng: riderLocation.lng }}
                  icon={{
                    url: iconUrl,
                    scaledSize: new window.google.maps.Size(80, 80),
                    anchor: new window.google.maps.Point(50, 50),
                  }}
                />
                <OverlayView
                  position={{ lat: riderLocation.lat, lng: riderLocation.lng }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  getPixelPositionOffset={(width, height) => ({
                    x: -width - 50,
                    y: -height - 80,
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
                      {t("rider")}
                    </Typography>
                  </Box>
                </OverlayView>
              </>
            )}
            {userLocation.lat && userLocation.lng && (
              <>
                <Marker
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  // icon={{
                  //   url: "/assets/images/user-location.png",
                  //   anchor: new window.google.maps.Point(20, 30),
                  //   scaledSize: new window.google.maps.Size(37, 37),
                  // }}
                  icon={{
                    url: "/assets/images/standing-human-3d.png",
                    scaledSize: new window.google.maps.Size(100, 100),
                    anchor: new window.google.maps.Point(50, 95), // Center bottom of the image
                  }}
                />
                <OverlayView
                  position={{ lat: userLocation.lat, lng: userLocation.lng }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  getPixelPositionOffset={(width, height) => ({
                    x: -width - 30,
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
                      {t("you")}
                    </Typography>
                  </Box>
                </OverlayView>
              </>
            )}
            {riderLocation.lat &&
              riderLocation.lng &&
              userLocation.lat &&
              userLocation.lng && (
                <Polyline
                  path={[riderLocation, userLocation]}
                  options={polylineOptions}
                />
              )}
          </GoogleMap>

          <Button onClick={getRiderPosition} sx={{ mt: 2 }}>
            Refresh
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default LiveTrackingModal;
