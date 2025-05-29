import React, { useState } from "react";
import { Typography, Box, Grid, Button, Card, Chip } from "@mui/joy";
import { useTheme } from "@mui/joy";
import { LazyLoadImage } from "react-lazy-load-image-component";
import FoodType from "../FoodType/FoodType";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CartModel from "../Models/CartModal";
import {
  RiHeartFill,
  RiHeartLine,
  RiShoppingCart2Line,
  RiStarFill,
  RiStarLine,
} from "@remixicon/react";
import { useMediaQuery } from "@mui/material";
import { isLogged } from "@/events/getters";
import { FavToggle, formatePrice } from "@/helpers/functionHelpers";
import Link from "next/link";
const ProductFlatCard = ({ Product }) => {
  const {
    id,
    image,
    name,
    indicator,
    variants,
    short_description,
    total_allowed_quantity,
    minimum_order_quantity,
    rating,
    min_max_price,
    partner_details,
    partner_id = "",
    product_add_ons,
    no_of_ratings,
    is_spicy = "0",
    best_seller = "0",
  } = Product;

  const settings = useSelector((state) => state.settings.value);

  const [isFavorite, setIsFavorite] = useState(Product?.is_favorite);

  const isDarkMode = useSelector((state) => state.darkMode.value);

  const theme = useTheme();
  const { t } = useTranslation();

  const [open, setOpen] = useState();
  const isMediumUp = useMediaQuery(theme.breakpoints.up("sm"));
  const iconSize = isMediumUp ? 20 : 16;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFavoriteToggle = async () => {
    let x = await FavToggle({
      isFavorite: isFavorite,
      favType: "products",
      Product: Product,
      setIsFavorite: setIsFavorite,
    });
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        p={1}
        sx={{
          backgroundColor: theme.palette.background.popup,
          boxShadow: "md",
        }}
        className=""
        borderRadius={"md"}
      >
        <Grid xs={4} sx={{ height: "100%" }}>
          <Box
            sx={{
              position: "relative",
              paddingTop: "100%",
              width: "100%",
              height: 0,
              borderRadius: "md",
              overflow: "hidden",
            }}
          >
            <Box component={"div"}>
              <Box
                component="img"
                src={image}
                srcSet={`${image} 2x`}
                loading="lazy"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderRadius: "md",
                  zIndex: 0, // Ensure image is behind the gradient
                }}
              />
            </Box>
            <Box
              component={"div"}
              onClick={() => setOpen(true)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
                zIndex: 1, // Ensure gradient is above the image
                backgroundImage: `linear-gradient(
            to top,
            rgba(0, 0, 0, 0.4),
            rgba(0, 0, 0, 0.2) 70%,
            rgba(0, 0, 0, 0.4)
          )`,
                borderRadius: "md",
              }}
            />
            {/* Favorite button */}
            <Box
              gap={1}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                p: 1,
                display: "flex",
                zIndex: 2, // Ensure buttons are above the gradient
              }}
            >
              <Box
                onClick={handleFavoriteToggle}
                sx={{
                  borderRadius: "xl",
                  width: "100%",
                  height: "100%",
                  padding: "4px",
                  backgroundColor: theme.palette.common.white,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {isFavorite === "1" ? (
                  <RiHeartFill
                    size={isMobile ? 10 : 16}
                    color={theme.palette.primary[600]}
                    cursor={"pointer"}
                  />
                ) : (
                  <RiHeartLine
                    color={theme.palette.primary[600]}
                    cursor={"pointer"}
                    size={isMobile ? 10 : 16}
                  />
                )}
              </Box>
            </Box>

            {/* Discount */}
            {variants[0]?.special_price !== "0" && (
              <Box
                sx={{
                  position: "absolute",
                  top: 10, // Position at the bottom of the parent container
                  right: { xs: -6, md: 0 },
                  textAlign: "center", // Center align the text
                  zIndex: 99,
                  minWidth: "5%",
                  transform: { xs: "none", sm: "none" },
                }}
              >
                {min_max_price &&
                  min_max_price.discount_in_percentage != "0" && (
                    <Typography
                      component="div" // Change this to avoid nesting div in p
                      sx={{
                        // fontSize: { xs: "xs", md: "sm" },
                        fontSize: { xs: "0.45rem", sm: "xs" },
                        padding: 0.1,
                        paddingX: { xs: 0, sm: 1 },
                        paddingX: { xs: 1, sm: 1 },
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.primary[500],
                        textAlign: "center",
                        borderRadius: { xs: "none", sm: "xs" },
                      }}
                    >
                      {min_max_price.discount_in_percentage}% {t("off")}
                    </Typography>
                  )}
              </Box>
            )}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {best_seller === "1" && (
                <Chip
                  startDecorator={
                    <Box
                      component="img"
                      src={"/assets/images/icon_bestseller.svg"}
                      alt="Best Seller"
                      sx={{
                        width: { xs: 10, md: 20 },
                        height: "100%",
                        filter:
                          isDarkMode == "dark"
                            ? "invert(58%) sepia(96%) saturate(2782%) hue-rotate(332deg) brightness(102%) contrast(101%)"
                            : "none",
                      }}
                    />
                  }
                  variant={isDarkMode == "dark" ? "outlined" : "soft"}
                  color="warning"
                  size="sm"
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    transform: "translateY(50%)",
                    zIndex: 2,
                    fontSize: { xs: "0.5rem", md: "sm" },
                    p: { xs: 0.25, md: 0.5 },
                  }}
                >
                  {t("best-seller")}
                </Chip>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid xs={8} height={"100%"}>
          <Box
            component={Link}
            href={`/restaurants/${partner_details[0].slug}`}
            gap={2}
            pr={1}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "start",
            }}
          >
            <Typography
              component="div" // Change this to avoid nesting div in p
              textAlign="start"
              variant="subtitle2"
              startDecorator={
                <>
                  <FoodType foodIndicator={indicator} size={16} />
                </>
              }
              sx={{
                fontSize: { xs: "xs", md: "sm" },
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              {partner_details[0].partner_name}
            </Typography>
            <Typography
              component="div" // Change this to avoid nesting div in p
              textAlign="center"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: { xs: "xs", md: "sm" },
                width: "25%",
              }}
              startDecorator={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <RiStarFill size={18} color={theme.palette.background.star} />
                </Box>
              }
            >
              {rating}
            </Typography>
          </Box>

          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "start",
              justifyContent: "start",
              flexDirection: "column",
            }}
          >
            <Typography
              component="div" // Change this to avoid nesting div in p
              fontWeight={theme.fontWeight.xl}
              onClick={() => setOpen(true)}
              sx={{
                color: theme.palette.text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
                width: "100%",
                maxWidth: "100%",
                fontSize: {
                  xs: "sm",
                  md: "md",
                },
              }}
              startDecorator={
                is_spicy === "1" ? (
                  <Box
                    component="img"
                    src="/assets/images/icon_spicy.svg"
                    alt="Spicy"
                    sx={{
                      width: 20,
                      height: "100%",
                      visibility: "visible",
                    }}
                  />
                ) : null
              }
            >
              {name}
            </Typography>

            <Typography
              component="div" // Change this to avoid nesting div in p
              variant="subtitle2"
              onClick={() => setOpen(true)}
              sx={{
                fontSize: { xs: "xs", md: "sm" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
                maxWidth: "100%",
                cursor: "pointer",
              }}
            >
              {short_description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              mt={1}
              gap={1}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                "@media (max-width: 320px)": {
                  flexDirection: "column",
                },
              }}
            >
              {variants[0].special_price != "0" ? (
                <>
                  <Typography
                    component="div" // Change this to avoid nesting div in p
                    onClick={() => setOpen(true)}
                    sx={{
                      fontSize: { xs: "sm", md: "md" },
                      color: theme.palette.text.currency,
                      fontWeight: theme.fontWeight.xl,
                      cursor: "pointer",
                    }}
                  >
                    {formatePrice(variants[0].special_price)}
                  </Typography>
                  {variants[0].price &&
                    variants[0].special_price !== variants[0].price && (
                      <Typography
                        component="div"
                        onClick={() => setOpen(true)}
                        mt={0.5}
                        sx={{
                          fontSize: { xs: "xs", md: "sm" },
                          textDecoration: "line-through",
                          cursor: "pointer",
                        }}
                      >
                        {formatePrice(variants[0].price)}
                      </Typography>
                    )}
                </>
              ) : (
                <>
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: "sm", md: "md" },
                      color: theme.palette.text.currency,
                      fontWeight: theme.fontWeight.xl,
                    }}
                  >
                    {formatePrice(variants[0].price)}
                  </Typography>
                </>
              )}
            </Box>
            <Box mt={{ xs: 0.5, sm: 0 }}>
              <Button
                sx={{
                  gap: 0,
                  paddingY: 0,
                  paddingX: { xs: 1, sm: 1.5 },
                  borderRadius: { xs: "sm", sm: "xl" },
                  fontSize: { xs: "xs", sm: "sm" },
                }}
                onClick={() => setOpen(true)}
                startDecorator={
                  <RiShoppingCart2Line
                    size={iconSize}
                    color={theme.palette.text.white}
                  />
                }
              >
                {t("add")}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <CartModel
        OpenDirect={true}
        OnOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        setModalOpen={setOpen}
        title={name}
        no_of_ratings={no_of_ratings}
        short_description={short_description}
        indicator={indicator}
        rating={rating}
        variants={variants}
        min_max_price={min_max_price}
        minimum_order_quantity={minimum_order_quantity}
        total_allowed_quantity={total_allowed_quantity}
        addons={product_add_ons}
        id={id}
        is_restro_open={partner_details?.[0]?.is_restro_open}
        image={image}
        partner_id={partner_id}
        partner_name={partner_details?.[0]?.partner_name}
        final_price={
          variants[0].special_price !== "0"
            ? variants[0].special_price
            : variants[0].price
        }
        selectedProductVariantPrice={Number(
          variants[0].special_price !== "0" && variants[0].special_price
            ? variants[0].special_price
            : variants[0].price
        )}
        selectedVariantID={variants[0].id}
      />
    </>
  );
};

export default ProductFlatCard;
