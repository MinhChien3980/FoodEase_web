import React from "react";
import { Box, Typography, Avatar, Divider, Grid, useTheme } from "@mui/joy";
import { useRouter } from "next/router";
import NotFound from "@/component/NotFound/NotFound";
import { getRelativeTime } from "../helpers/functionHelpers";
import openLightbox from "@/component/ImageBox/ImageLightbox";

const NotificationsView = ({ notification = [] }) => {
  const router = useRouter();

  const handleNotificationClick = (type, slug) => {
    if (type === "categories") {
      router.push(`/categories/${slug}`);
    }
  };

  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      {notification?.map((notif) => (
        <Grid key={notif.id} xs={12} md={6}>
          <Box
            onClick={() => handleNotificationClick(notif.type, notif.slug)}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 2,
              cursor: notif.type !== "default" ? "pointer" : "default",
              borderRadius: "md",
              boxShadow: "sm",
              backgroundColor: theme.palette.background.surface,
            }}
          >
            {/* Avatar on the left */}
            <Box
              className="cursor"
              sx={{ height: "100%", width: 100 }}
              component={"div"}
              onClick={() => {
                openLightbox([
                  { src: notif.image, alt: notif.title, title: notif.title },
                ]);
              }}
            >
              <Avatar
                src={notif.image}
                alt={notif.title}
                sx={{ marginRight: 2, width: 70, height: 70 }}
                size="lg"
              />
            </Box>

            {/* Notification content on the right */}
            <Box flexGrow={1} mr={2}>
              <Typography
                level="h5"
                sx={{
                  fontWeight: "lg",
                  fontSize: "xl",
                  color: theme.palette.text.primary,
                }}
              >
                {notif.title}
              </Typography>
              <Typography
                level="body2"
                sx={{
                  color: theme.palette.text.primary,
                  maxHeight: "3em",
                  minHeight: "3em",
                  overflowY: "auto",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {notif.message}
              </Typography>

              <Typography
                mt={0.5}
                level="caption"
                sx={{
                  color: theme.palette.text.primary,
                  textAlign: "end",
                }}
              >
                {getRelativeTime(notif.date_sent)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}

      {notification.length === 0 && (
        <Grid xs={12}>
          <NotFound />
        </Grid>
      )}
    </Grid>
  );
};

export default NotificationsView;
