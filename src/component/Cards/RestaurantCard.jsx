import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Divider,
  Grid,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/joy";
import Link from "next/link";
import TimeFillIcon from "remixicon-react/TimeFillIcon";
import HeartLineIcon from "remixicon-react/HeartLineIcon";
import HeartFillIcon from "remixicon-react/HeartFillIcon";
import { useDispatch, useSelector } from "react-redux";
import RatingBox from "../RatingBox/RatingBox";
import FoodType from "../FoodType/FoodType";
import { useTranslation } from "react-i18next";
import { FavToggle, formatePrice } from "@/helpers/functionHelpers";

const RestaurantCard = ({ restaurant, handleFavoriteToggleParent }) => {
  const [isFavorite, setIsFavorite] = useState(restaurant?.is_favorite == "1");
  const settings = useSelector((state) => state.settings.value);
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.homepage?.restaurants);

  useEffect(() => {
    setIsFavorite(restaurant?.is_favorite);
  }, [restaurant]);

  const handleFavoriteToggle = async () => {
    let x = await FavToggle({
      isFavorite: isFavorite,
      favType: "partners",
      restaurant: restaurant,
      setIsFavorite: setIsFavorite,
      handleFavoriteToggleParent,
    });
  };
  const handleMapClick = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${Number(
      restaurant.latitude
    )},${Number(restaurant.longitude)}`;
    window.open(url, "_blank");
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
            }}
          >
            <Box
              component={Link}
              href={"/restaurants/" + restaurant?.slug}
              sx={{
                width: "100%",
                height: "100%",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                overflow: "hidden ",
              }}
            >
              <Box
                component="img"
                src={restaurant?.partner_profile}
                alt="Partner profile"
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden ",
                  objectFit: "cover",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              />
            </Box>

            <Box
              sx={{
                position: "absolute",
                top: "12px",
                right: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px", // Space between heart and map icons
              }}
            >
              {/* Google Map Icon without Background */}
              <Tooltip title="Open in Google Maps" placement="bottom">
                <Box
                  sx={{
                    borderRadius: "xl",
                    padding: 0.5,
                    backgroundColor: theme.palette.common.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/images/google-map-pin.svg"
                    alt="Google Map Icon"
                    width={24}
                    height={24}
                    sx={{ cursor: "pointer" }}
                    onClick={handleMapClick}
                  />
                </Box>
              </Tooltip>

              {/* Heart Icon with White Background */}
              <Box
                sx={{
                  borderRadius: "xl",
                  padding: 0.8,
                  backgroundColor: theme.palette.common.white,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isFavorite == "1" ? (
                  <HeartFillIcon
                    size={18}
                    onClick={handleFavoriteToggle}
                    color={theme.palette.primary[600]}
                    cursor={"pointer"}
                  />
                ) : (
                  <HeartLineIcon
                    color={theme.palette.primary[600]}
                    cursor={"pointer"}
                    size={18}
                    onClick={handleFavoriteToggle}
                  />
                )}
              </Box>
            </Box>

            {/* cooking time */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                whiteSpace: "nowrap",
                bottom: { xs: "8%", sm: "7%" },
                right: { xs: "8%", sm: "2.5%" },
                backgroundColor: theme.palette.background.cookingTime,
                borderRadius: theme.radius.lg,
                width: { xs: "45%", sm: "30%" },
                height: "20%",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: { xs: "xs", md: "sm" },
                  padding: 0.5,
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.palette.text.black,
                }}
                startDecorator={<TimeFillIcon alignmentBaseline="center" />}
              >
                {restaurant?.partner_cook_time}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        paddingX={2}
        paddingBottom={3}
        component={Link}
        href={"/restaurants/" + restaurant?.slug}
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
            {restaurant?.partner_name &&
              restaurant.partner_name.replace(/\\/g, "").replace(/\\'/g, "'")}
          </Typography>
        </Grid>

        <Grid xs={8}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "xs", md: "sm" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: "1.2em",
                maxHeight: "2.4em",
                marginBottom: "auto",
              }}
            >
              {restaurant?.description}
            </Typography>
          </Box>
        </Grid>

        <Grid xs={4} display="flex" justifyContent="flex-end">
          <RatingBox
            partnerRating={restaurant.partner_rating}
            totalRaters={restaurant.no_of_ratings}
          />
        </Grid>

        <Grid xs={12}>
          <Divider sx={{ my: 1, height: 2 }} />
        </Grid>
        {/* is restro open */}
        {restaurant.is_restro_open === 0 ? (
          <Typography
            variant="h6"
            component="h5"
            color="error"
            sx={{ fontWeight: 300 }}
          >
            {t("currently_closed")}
          </Typography>
        ) : null}

        <Grid xs={10}>
          {restaurant.price_for_one && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <Typography
                variant="subtitle1"
                fontSize="md"
                sx={{
                  color: theme.palette.text.currency,
                  fontSize: { xs: "xs", md: "md" },
                  fontWeight: "md",
                  marginRight: 1, // Use theme.spacing(1) if you prefer
                }}
              >
                {formatePrice(restaurant.price_for_one)}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontSize: { xs: "xs", md: "md" } }}
              >
                {t("for-one")}
              </Typography>
            </Box>
          )}
        </Grid>

        <Grid
          xs={2}
          display="flex"
          gap={1}
          justifyContent="flex-end"
          alignItems="center"
        >
          <FoodType foodIndicator={restaurant?.partner_indicator} />
        </Grid>

        {!restaurant.is_restro_open && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary[600],
              position: "absolute",
              bottom: 2,
            }}
          >
            {t("currently-closed")}
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default RestaurantCard;
