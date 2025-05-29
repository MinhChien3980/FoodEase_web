import { Box, Button, Chip, Grid, Typography, useTheme } from "@mui/joy";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import FoodType from "../FoodType/FoodType";
import RatingStar from "../RatingBox/Rating";
import { useDispatch, useSelector } from "react-redux";
import HeartLineIcon from "remixicon-react/HeartLineIcon";
import HeartFillIcon from "remixicon-react/HeartFillIcon";
import CartModel from "../Models/CartModal";
import { useTranslation } from "react-i18next";
import { FavToggle } from "@/helpers/functionHelpers";
import { formatePrice } from "@/helpers/functionHelpers";
import Link from "next/link";
import ShoppingCart2LineIcon from "remixicon-react/ShoppingCart2LineIcon";
const ProductCard = ({
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
    end_time,
    start_time,
  } = Product;
  const settings = useSelector((state) => state.settings.value);
  const [isFavorite, setIsFavorite] = useState(Product?.is_favorite);
  const [open, setOpen] = useState(false);
  const currency = settings?.system_settings[0]?.currency;
  const isDarkMode = useSelector((state) => state.darkMode.value);

  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    setIsFavorite(Product?.is_favorite);
  }, [Product]);

  const handleFavoriteToggle = async () => {
    let x = await FavToggle({
      isFavorite: isFavorite,
      favType: "products",
      Product: Product,
      setIsFavorite: setIsFavorite,
      handleFavoriteToggleParent,
    });
  };
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={1}
      borderRadius={"xl"}
      mb={5}
      position="relative"
      width={"100%"}
      sx={{ boxShadow: "md" }}
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
            overflow="hidden"
            position="relative"
            sx={{
              height: { xs: "130px", sm: "200px" },
              width: "100%",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          >
            <Box
              component={"div"}
              onClick={() => setOpen(true)}
              sx={{ cursor: "pointer" }}
            >
              <Box
                component="img"
                src={image}
                className="position-absolute object-fit top-0 left-0"
                alt="Partner profile"
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden ",
                }}
              />
            </Box>
            <Box
              position="absolute"
              top="12px"
              right="12px"
              display={"flex"}
              gap={1}
            >
              <>
                <FoodType size={28} foodIndicator={Product?.indicator} />
              </>
              <Box
                onClick={handleFavoriteToggle}
                sx={{
                  borderRadius: "xl",
                  width: "100%",
                  height: "100%",
                  padding: { xs: "3px", sm: "6px" },
                  backgroundColor: theme.palette.common.white,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {isFavorite == "1" ? (
                  <HeartFillIcon
                    size={18}
                    color={theme.palette.primary[600]}
                    cursor={"pointer"}
                  />
                ) : (
                  <HeartLineIcon
                    color={theme.palette.primary[600]}
                    cursor={"pointer"}
                    size={18}
                  />
                )}
              </Box>
            </Box>
            {best_seller === "1" && (
              <Chip
                startDecorator={
                  <Box
                    component="img"
                    src={"/assets/images/icon_bestseller.svg"}
                    alt="Best Seller"
                    sx={{
                      width: 20,
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
                  right: 10,
                  bottom: 25,
                  transform: "translateY(50%)",
                  zIndex: 2,
                  padding: 0.5,
                  paddingX: 1,
                }}
              >
                {t("best-seller")}
              </Chip>
            )}
            {variants[0]?.special_price != "0" && (
              <>
                {min_max_price &&
                  min_max_price.discount_in_percentage !== 0 && (
                    <Box
                      position="absolute"
                      top={{ xs: "10%", sm: "8%" }}
                      left={{ xs: "5%", sm: "5%" }}
                      bgcolor={theme.palette.primary[500]}
                      borderRadius={"md"}
                      minWidth={"5%"}
                      className="flexProperties"
                    >
                      <Typography
                        textColor={theme.palette.common.white}
                        sx={{
                          textAlign: "center",
                          fontSize: { xs: "0.8rem", sm: "sm" },
                          padding: 0.1,
                          paddingX: { xs: 0, sm: 1 },
                          paddingX: { xs: 1, sm: 1 },
                        }}
                      >
                        {min_max_price.discount_in_percentage}% {t("off")}
                      </Typography>
                    </Box>
                  )}
              </>
            )}
          </Box>
        </Grid>

        <Grid xs={12} paddingX={2} pt={0.5}>
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Grid
              component={Link}
              href={`/restaurants/${partner_details?.[0]?.slug}`}
              xs={4}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "nowrap",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={theme.fontWeight.md}
                noWrap
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontSize: { xs: "xs", sm: "sm" },
                }}
              >
                {partner_details[0].partner_name}
              </Typography>
            </Grid>

            <Grid
              xs={8}
              sx={{
                display: "flex",
                alignItems: "start",
                justifyContent: "end",
                paddingTop: 0.5,
                whiteSpace: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <RatingStar value={rating} size={16} />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          xs={12}
          paddingX={2}
          display={"flex"}
          alignItems={"start"}
          justifyContent={"start"}
          component={"div"}
          onClick={() => setOpen(true)}
          sx={{ cursor: "pointer" }}
        >
          <Typography
            fontWeight={theme.fontWeight.xl}
            noWrap
            sx={{
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",

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
        </Grid>
        <Grid
          component={"div"}
          onClick={() => setOpen(true)}
          xs={12}
          paddingX={2}
          sx={{
            height: "fit-content",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: { xs: "xs", sm: "sm" },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap", // Prevents text from wrapping to multiple lines
              display: "block", // Ensures the element behaves like a block element
            }}
          >
            {short_description}
          </Typography>
        </Grid>

        <Grid
          xs={12}
          sm={6}
          mt={1}
          sx={{
            display: "flex",
            alignItems: "start",
            flexDirection: "row",
            paddingX: 2,
          }}
        >
          <Box
            variant="subtitle2"
            fontWeight={theme.fontWeight.xl}
            sx={{ width: "100%" }}
          >
            <Box
              component={"div"}
              onClick={() => setOpen(true)}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
                color: theme.palette.text.currency,
                fontSize: { xs: "sm", sm: "lg" },
              }}
            >
              {/* If special_price is not 0, render it; otherwise, render the regular price */}
              {variants[0].special_price != "0" ? (
                <>
                  <Box
                    sx={{
                      color: theme.palette.text.currency,
                      fontSize: { xs: "sm", sm: "lg" },
                    }}
                  >
                    {formatePrice(variants[0].special_price)}
                  </Box>
                  <Box
                    sx={{
                      marginLeft: 1,
                      fontSize: { xs: "sm", sm: "sm" },
                      textDecoration: "line-through",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {formatePrice(variants[0].price)}
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    color: theme.palette.text.currency,
                    fontSize: { xs: "sm", sm: "lg" },
                  }}
                >
                  {formatePrice(variants[0].price)}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid
          xs={12}
          sm={6}
          mb={2}
          mt={1}
          paddingY={0.1}
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: { xs: "start", sm: "end" },
            flexDirection: "row",
            paddingX: 1,
          }}
        >
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
            currency={currency}
            start_time={start_time}
            end_time={end_time}
            final_price={
              variants[0].special_price != "0"
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductCard;
