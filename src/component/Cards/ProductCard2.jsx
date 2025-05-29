import { Box, Button, Chip, Grid, Typography, useTheme } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useDispatch, useSelector } from "react-redux";
import HeartLineIcon from "remixicon-react/HeartLineIcon";
import HeartFillIcon from "remixicon-react/HeartFillIcon";
import { remove_from_favorites, add_to_favorites } from "@/interceptor/api";
import toast from "react-hot-toast";
import CartModel from "../Models/CartModal";
import { isLogged } from "@/events/getters";
import { useTranslation } from "react-i18next";
import FoodType from "../FoodType/FoodType";
import { useMediaQuery } from "@mui/material";

import { FavToggle, formatePrice } from "@/helpers/functionHelpers";
import ShoppingCart2LineIcon from "remixicon-react/ShoppingCart2LineIcon";
const ProductCard2 = ({
  Product,
  handleFavoriteToggleParent,
  is_section_product = false,
}) => {
  const {
    id,
    image,
    name,
    partner_name,
    indicator,
    price,
    addons,
    variants = [],
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
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDarkMode = useSelector((state) => state.darkMode.value);

  useEffect(() => {
    setIsFavorite(Product?.is_favorite);
  }, [Product]);
  const handleFavoriteToggle = async (event) => {
    event.stopPropagation();
    let x = await FavToggle({
      isFavorite: isFavorite,
      favType: "products",
      Product: Product,
      setIsFavorite: setIsFavorite,
      handleFavoriteToggleParent,
    });
  };
  if (variants.length === 0) {
    return null;
  }
  return (
    <Box width={"100%"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={1}
        mb={5}
        position="relative"
        sx={{
          cursor: "pointer",
          boxShadow: "md",
          borderRadius: "xl",
          position: "relative",
          overflow: "hidden",
          "::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0) 200px), linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 300px)`,
          },
        }}
        onClick={() => setOpen(true)}
      >
        <Grid container>
          <Grid
            xs={12}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            height={"100%"}
          >
            <Box
              position="relative"
              sx={{
                height: { xs: "175px", sm: "250px" },
                width: "100%",
              }}
            >
              <LazyLoadImage
                src={image}
                srcSet={`${image} 2x`}
                loading="lazy"
                effect="blur"
                alt={image}
                className="full-screen-centered"
              />

              <Box
                position="absolute"
                top="12px"
                left="12px"
                right="12px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                zIndex={2}
              >
                <Box>
                  {best_seller === "1" && (
                    <Chip
                      startDecorator={
                        <Box
                          component="img"
                          src={"/assets/images/icon_bestseller.svg"}
                          alt="Best Seller"
                          sx={{
                            width: { xs: 14, md: 20 },
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
                        padding: 0.5,
                        fontSize: { xs: "0.5rem", md: "sm" },
                      }}
                    >
                      {t("best-seller")}
                    </Chip>
                  )}
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <FoodType foodIndicator={indicator} size={16} />
                  <Box
                    className="borderRadiusMd"
                    component={"div"}
                    onClick={handleFavoriteToggle}
                    sx={{
                      padding: "6px",
                      backgroundColor: theme.palette.common.white,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {isFavorite == "1" ? (
                      <HeartFillIcon
                        size={isMobile ? 12 : 16}
                        color={theme.palette.primary[600]}
                        cursor={"pointer"}
                      />
                    ) : (
                      <HeartLineIcon
                        color={theme.palette.primary[600]}
                        cursor={"pointer"}
                        size={isMobile ? 12 : 16}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              {variants[0]?.special_price != "0" && (
                <>
                  {min_max_price &&
                    min_max_price.discount_in_percentage !== 0 && (
                      <Box
                        component={"div"}
                        onClick={() => setOpen(true)}
                        position="absolute"
                        zIndex="3"
                        top={{ xs: "47%", sm: "55%" }}
                        left="6%"
                        minWidth={"5%"}
                        color={theme.palette.text.white}
                        className="flexProperties"
                        sx={{ cursor: "pointer" }}
                      >
                        <Typography
                          fontWeight={theme.fontWeight.xl}
                          textColor={theme.palette.primary[50]}
                          sx={{
                            textAlign: "center",
                            fontSize: { xs: "sm", md: "md" },
                            fontWeight: "xl",
                          }}
                        >
                          {min_max_price.discount_in_percentage}% {t("off")}
                        </Typography>
                      </Box>
                    )}
                </>
              )}
              <Box
                position="absolute"
                bottom={{ xs: "28%", sm: "24%" }}
                left="6%"
                zIndex={2}
                component={"div"}
                onClick={() => setOpen(true)}
                sx={{ cursor: "pointer" }}
              >
                <Typography
                  sx={{
                    color: theme.palette.text.white,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    fontSize: "md",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 1,
                    fontWeight: "xl",
                    fontSize: { xs: "sm", sm: "md" },
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
              </Box>
              <Box
                position="absolute"
                bottom="6%"
                right="5%"
                zIndex={2}
                component={"div"}
                onClick={() => setOpen(true)}
                sx={{ cursor: "pointer" }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    color: theme.palette.background.level1,
                  }}
                >
                  {/* If special_price is not 0, render both special price and regular price; otherwise, render only the regular price */}
                  {variants[0]?.special_price !== "0" ? (
                    <>
                      <Typography
                        sx={{
                          color: theme.palette.background.level1,
                          fontSize: { xs: "sm", sm: "md", lg: "xl" },
                          fontWeight: "xl",
                        }}
                      >
                        {formatePrice(variants[0].special_price)}
                      </Typography>
                      <Typography
                        sx={{
                          marginLeft: 1,
                          fontSize: { xs: "xs", md: "md" },
                          textDecoration: "line-through",
                          color: theme.palette.background.level1,
                        }}
                      >
                        {formatePrice(variants[0].price)}
                      </Typography>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        color: theme.palette.background.level1,
                        fontSize: { xs: "sm", sm: "md", lg: "xl" },
                        fontWeight: "xl",
                      }}
                    >
                      {formatePrice(variants[0].price)}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box position="absolute" bottom="6%" left="5%" zIndex={2}>
                <Button
                  sx={{
                    gap: { xs: 0.5, sm: 1 },
                    paddingY: { xs: 0.5, sm: 1, md: 1, lg: 1 },
                    paddingX: { xs: 2, sm: 1.5, md: 1, lg: 2 },
                    borderRadius: "xl",
                  }}
                  size="small"
                  onClick={() => setOpen(true)}
                  startDecorator={
                    <ShoppingCart2LineIcon
                      size="18"
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
      </Box>
      <CartModel
        OpenDirect={true}
        OnOpen={open}
        onClose={() => {
          setOpen(false);
        }}
        is_section_product={is_section_product}
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
          variants[0]?.special_price != "0"
            ? variants[0]?.special_price
            : variants[0].price
        }
        selectedProductVariantPrice={Number(
          variants[0].special_price !== "0" && variants[0].special_price
            ? variants[0].special_price
            : variants[0].price
        )}
        selectedVariantID={variants[0].id}
      />
    </Box>
  );
};

export default ProductCard2;
