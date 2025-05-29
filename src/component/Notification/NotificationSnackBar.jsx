import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/joy";
import FirebaseData from "@/@core/firebase";
import { RiCloseFill } from "@remixicon/react";
import { useRouter } from "next/router";

const RETRY_DELAY_MS = 2000;

const NotificationSnackBar = () => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState({});
  const theme = useTheme();
  const router = useRouter();

  const onClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const showSystemNotification = (title, options) => {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  };

  const initializeMessaging = async () => {
    let retryCount = 0;

    if (FirebaseData() === false) {
      return;
    }
    const { messaging } = FirebaseData();

    while (retryCount < 15) {
      try {
        messaging.onMessage((payload) => {
          const { title, body, image, type = "#" } = payload.data;
          setNotification({ title, body, image, type });
          setOpen(true);

          showSystemNotification(title, {
            body: body,
            icon: image,
          });
        });
        return;
      } catch (error) {
        console.error("Firebase initialization error: at snackbar", error);
        retryCount += 1;
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }

    console.error(
      "Failed to initialize Firebase messaging after multiple retries."
    );
  };

  useEffect(() => {
    initializeMessaging();
    return () => {
      const { messaging } = FirebaseData();
      messaging.onMessage(() => {});
    };
  }, []);

  const redirect = () => {
    if (notification.type === "order") {
      router.push("/user/orders");
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={10000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        width: { xs: "90%", sm: "auto" },
        maxWidth: "600px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          backgroundColor: "background.surface",
          borderRadius: "sm",
          gap: 1.5,
        }}
      >
        {notification.image && (
          <Avatar
            src={notification.image}
            alt="Notification Icon"
            size="lg"
            sx={{ flexShrink: 0 }}
          />
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minWidth: 0, // This prevents text from overflowing
          }}
          onClick={redirect}
        >
          <Typography
            level="title-sm"
            sx={{
              mb: 0.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {notification.title}
          </Typography>
          {notification.body && (
            <Typography
              level="body-sm"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {notification.body}
            </Typography>
          )}
        </Box>

        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={(e) => {
            e.stopPropagation();
            onClose(e);
          }}
          sx={{
            flexShrink: 0,
            mt: -0.5,
            mr: -0.5,
          }}
        >
          <RiCloseFill />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default NotificationSnackBar;
