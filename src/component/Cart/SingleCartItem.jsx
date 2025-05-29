import {
  Grid,
  Box,
  Typography,
  useTheme,
  FormControl,
  IconButton,
  Button,
} from "@mui/joy";
import { CardMedia } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import FoodType from "../FoodType/FoodType";
import { useSelector } from "react-redux";
import {
  RiAddFill,
  RiDeleteBin5Line,
  RiPencilLine,
  RiSubtractFill,
} from "@remixicon/react";
import toast from "react-hot-toast";
import { add_to_cart, get_delivery_charges } from "@/interceptor/api";
import {
  RemoveCartItem,
  findAddonsByVariantId,
  handleReApplyPromoCode,
  updateUserCart,
} from "@/events/actions";
import CartModel from "../Models/CartModal";
import { useTranslation } from "react-i18next";
import openLightbox from "@/component/ImageBox/ImageLightbox";
import { formatePrice } from "@/helpers/functionHelpers";

// Debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SingleCartItem = ({ item }) => {
  const settings = useSelector((state) => state.settings.value);
  const currency = settings?.system_settings[0]?.currency;
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(Number(item.qty));
  const [variantID, setVariantID] = useState();
  const [addons, setAddons] = useState();
  const [selectedAddons, setSelectedAddons] = useState();
  const [variants, setVariants] = useState();

  const promoCodeState = useSelector((state) => state.promoCode.value);
  const overall_amount = useSelector((state) => state.cart?.overall_amount);
  useEffect(() => {
    setQuantity(Number(item.qty));
    const VARIANT_ID = item.product_variant_id;
    setVariantID(VARIANT_ID);
    const productAddonData = item.product_details[0].variants;
    setVariants(productAddonData);
    const productAddonData2 = productAddonData.flatMap(
      (item) => item.add_ons_data
    );
    const SELECTED_ADDONS = findAddonsByVariantId(productAddonData, VARIANT_ID);

    setSelectedAddons(SELECTED_ADDONS);
    const ProductAddonIds = productAddonData2
      .map((item) => item.add_on_id)
      .join(",");

    setAddons(ProductAddonIds);
  }, [item]);

  useEffect(() => {
    const VARIANT_ID = item.product_variant_id;
    setVariantID(VARIANT_ID);
    const productAddonData = item.product_details[0].variants;
    setVariants(productAddonData);
    const productAddonData2 = productAddonData.flatMap(
      (item) => item.add_ons_data
    );

    const SELECTED_ADDONS = findAddonsByVariantId(productAddonData, VARIANT_ID);

    setSelectedAddons(SELECTED_ADDONS);
    const ProductAddonIds = productAddonData2
      .map((item) => item.add_on_id)
      .join(",");

    setAddons(ProductAddonIds);
  }, [item.product_details, item.product_variant_id]);

  const debouncedUpdateCart = useCallback(
    debounce(async (newQuantity) => {
      try {
        const response = await add_to_cart({
          product_variant_id: variantID,
          qty: newQuantity,
          add_on_id: addons,
          add_on_qty: Array.isArray(newQuantity)
            ? newQuantity.join(",")
            : addons
                .split(",")
                .map(() => newQuantity)
                .join(","),
        });

        if (response.error) {
          toast.error(response.message);
        } else {
          await updateUserCart();
          if (promoCodeState.length > 0) {
            handleReApplyPromoCode();
          }
          toast.success(response.message);
        }
      } catch (error) {
        console.error("Error while adding to cart:", error);
      }
    }, 800),
    [variantID, addons, promoCodeState]
  );

  const updateCart = (newQuantity) => {
    setQuantity(newQuantity);
    debouncedUpdateCart(newQuantity);
  };

  const handleDecrement = () => {
    if (quantity > item.minimum_order_quantity) {
      const newQuantity = quantity - 1;
      updateCart(newQuantity);
    } else {
      toast.error(`Minimum Allowed Quantity is ${item.minimum_order_quantity}`);
    }
  };

  const handleIncrement = () => {
    if (
      item.total_allowed_quantity === "" ||
      quantity < item.total_allowed_quantity
    ) {
      const newQuantity = quantity + 1;
      updateCart(newQuantity);
    } else {
      toast.error(
        `Maximum ${item.total_allowed_quantity} items allowed to Add`
      );
    }
  };

  const { t } = useTranslation();

  let ProductPrice =
    item.special_price != "0" ? item.special_price : item.price;
  return (
    <>
      <Grid container width="100%" spacing={1}>
        <Grid xs={5} sm={3} xl={2} position="relative" order={{ xs: 1 }}>
          <Box
            sx={{
              width: { xs: "84px", sm: "120px" },
              height: { xs: "84px", sm: "100px" },
              overflow: "hidden",
              borderRadius: "md",
            }}
          >
            <CardMedia
              component="img"
              image={item.image}
              onClick={() => {
                openLightbox([
                  {
                    src: item.image,
                    alt: item.product_details[0].name,
                    title: item.product_details[0].name,
                  },
                ]);
              }}
              sx={{
                objectFit: "cover",
                width: { xs: "100%", sm: "100%" },
                height: { xs: "100%", sm: "100%" },
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.07)",
                },
              }}
            />
          </Box>
          {/* Absolute positioning for the small image */}
          <Box
            sx={{
              position: "absolute",
              top: 14,
              left: 4,
              width: "30%", // Adjust the size as needed
              zIndex: 1, // Ensure the small image is above the main image
            }}
          >
            <FoodType
              foodIndicator={item.product_details[0].indicator}
              size={18}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={7} lg={6} xl={7} order={{ xs: 3, sm: 2 }}>
          <Typography
            variant="h1"
            fontWeight="xl"
            startDecorator={
              item.product_details[0].is_spicy === "1" ? (
                <Box component="img" src="/assets/images/icon_spicy.svg" />
              ) : null
            }
            sx={{
              color: theme.palette.text.primary,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              fontSize: { xs: "sm", sm: "md" },
            }}
          >
            {item.product_details[0].name}
          </Typography>

          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems="center"
            gap={1}
            marginTop={1} // Add margin top here if needed
          >
            <Typography
              variant="h1"
              fontWeight={"xl"}
              startDecorator={currency}
              sx={{
                color: theme.palette.text.currency,
                fontSize: {
                  xs: "lg",
                },
                marginRight: "4px",
              }}
            >
              {ProductPrice}
            </Typography>
            <Typography
              variant="h1"
              fontWeight={"xl"}
              sx={{
                color: theme.palette.text.primary,
                fontSize: {
                  xs: "md",
                },
              }}
            >
              {item.product_variants?.[0]?.variant_values}
            </Typography>
            <Button
              variant="plain"
              onClick={() => setOpen(true)}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent", // Set background to transparent on hover
                },
              }}
            >
              <Typography
                variant="h1"
                fontWeight={"xl"}
                startDecorator={<RiPencilLine size={22} />}
                sx={{
                  color: theme.palette.text.primary,
                }}
              />
            </Button>
            <Button
              variant="plain"
              onClick={() => RemoveCartItem(variantID)}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent", // Set background to transparent on hover
                },
              }}
            >
              <Typography
                variant="h1"
                startDecorator={<RiDeleteBin5Line />}
                fontWeight={"xl"}
                sx={{ color: theme.palette.danger[600] }}
              />
            </Button>
          </Box>
          {selectedAddons && selectedAddons?.length > 0 && (
            <>
              <Typography
                variant="h6"
                fontWeight={"lg"}
                sx={{ color: theme.palette.text.primary }}
                fontSize={"sm"}
              >
                {t("extra-add-ons")}
              </Typography>
              {selectedAddons.map((addon, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1 }}>
                  <Typography variant="subtitle1" fontSize={"sm"}>
                    {addon.title}:
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.currency }}>
                    {formatePrice(addon.price)}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </Grid>

        <Grid xs={7} sm={2} lg={3} xl={2} order={{ xs: 2, sm: 3 }}>
          <FormControl size="sm" sx={{ width: "100%" }}>
            <Box
              display={"flex"}
              justifyContent={{ sm: "center", xs: "flex-end" }}
              alignItems={"center"}
              gap={1}
            >
              <IconButton
                onClick={handleDecrement}
                size="sm"
                variant="outlined"
                color="neutral"
              >
                <RiSubtractFill />
              </IconButton>
              <Typography mx={1}>{quantity}</Typography>
              <IconButton
                onClick={handleIncrement}
                size="sm"
                variant="outlined"
                color="primary"
              >
                <RiAddFill />
              </IconButton>
            </Box>
          </FormControl>
        </Grid>
      </Grid>

      {open && (
        <CartModel
          OpenDirect={true}
          OnOpen={open}
          onClose={() => {
            setOpen(false);
          }}
          setModalOpen={setOpen}
          variants={variants}
          title={item.name}
          currency={currency}
          image={item.image}
          addons={item.product_details[0]?.product_add_ons}
          rating={item.product_details[0]?.rating}
          short_description={item.short_description}
          total_allowed_quantity={item.total_allowed_quantity}
          minimum_order_quantity={item.minimum_order_quantity}
          min_max_price={item.product_details[0].min_max_price}
          partner_id={item.product_details[0]?.partner_id}
          is_restro_open={
            item?.product_details?.[0]?.partner_details?.[0]?.is_restro_open
          }
          partner_name={item.product_details[0].partner_details[0].partner_name}
          no_of_ratings={item.product_details[0]?.no_of_ratings}
          selectedAddons={selectedAddons}
          selectedVariantID={variantID}
          selectedProductVariantPrice={ProductPrice}
          product_qty={quantity}
          is_cart_page={true}
          start_time={item.product_details[0]?.start_time}
          end_time={item.product_details[0]?.end_time}
        />
      )}
    </>
  );
};

export default SingleCartItem;
