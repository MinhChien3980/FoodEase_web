import React from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  useTheme,
} from "@mui/joy";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const RestaurantCard = ({ restaurant }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Array of default restaurant images
  const defaultImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Restaurant interior
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Restaurant dining
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Restaurant kitchen
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Restaurant exterior
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Modern restaurant
  ];

  // Select image based on restaurant ID to ensure consistency
  const getDefaultImage = () => {
    const index = restaurant?.id ? restaurant.id % defaultImages.length : 0;
    return defaultImages[index];
  };

  return (
    <Box sx={{ boxShadow: "md" }} p={0} borderRadius={"xl"}>
      <Grid
        container
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <Grid
          xs={12}
          sx={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}
        >
          <Box
            sx={{
              position: "relative",
              height: { xs: "130px", sm: "200px" },
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              backgroundColor: theme.palette.background.body,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={getDefaultImage()}
              alt={restaurant?.name || "Restaurant"}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
              onError={(e) => {
                // Fallback to a gradient background if image fails to load
                e.target.style.display = "none";
                e.target.parentElement.style.background = "linear-gradient(45deg, #FF6B6B, #4ECDC4)";
                const fallbackText = document.createElement("div");
                fallbackText.innerHTML = restaurant?.name?.[0]?.toUpperCase() || "R";
                fallbackText.style.fontSize = "3rem";
                fallbackText.style.color = "white";
                fallbackText.style.fontWeight = "bold";
                e.target.parentElement.appendChild(fallbackText);
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        paddingX={2}
        paddingBottom={3}
        component={Link}
        href={"/restaurants/" + restaurant?.id}
      >
        <Grid xs={12}>
          <Typography
            variant="h1"
            fontSize={{ xs: "sm", sm: "xl" }}
            marginTop={{ xs: 0.5, sm: 0 }}
            fontWeight={theme.fontWeight.xl}
            sx={{
              color: theme.palette.text.primary,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              fontSize: "md",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 1,
            }}
          >
            {restaurant?.name}
          </Typography>
        </Grid>

        <Grid xs={12}>
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: { xs: "xs", md: "sm" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: "1.2em",
              maxHeight: "2.4em",
              marginBottom: 1,
              color: theme.palette.text.secondary,
            }}
          >
            {restaurant?.address}
          </Typography>
        </Grid>

        <Grid xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "xs", md: "sm" },
                color: theme.palette.text.tertiary,
              }}
            >
              {restaurant?.menuItems?.length || 0} {t("menu-items")}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantCard;
