import React, { useEffect, useState } from "react";
import CartModel from "../Models/CartModal";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/joy";
import {
  RiAddFill,
  RiDeleteBin5Line,
  RiPencilLine,
  RiSubtractFill,
} from "@remixicon/react";
import FoodType from "../FoodType/FoodType";
import { CardMedia } from "@mui/material";
import { updateCartOfflineItem } from "@/store/reducers/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatePrice, getSelectedAddons } from "@/helpers/functionHelpers";
import { Remove_from_offlineCart } from "@/events/actions";
import { useTranslation } from "react-i18next";

const OfflineCartItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(item.qty);
  const [selectedAddons, setSelectedAddons] = useState();

  let product_variant_id = item.product_variant_id;


  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      updateCartOfflineItem({
        product_variant_id,
        updates: { qty: quantity },
      })
    );
  }, [product_variant_id, quantity, dispatch]);

  useEffect(() => {
    let x = getSelectedAddons(item.addonsId, item.addons);
    setSelectedAddons(x);
    setQuantity(item.qty);
  }, [item]);

  const quantityManage = async (type, product_variant_id) => {
    if (type === "increment") {
      await setQuantity(Number(quantity) + 1);
    } else {
      if (quantity > 1) {
        await setQuantity(Number(quantity) - 1);
      }
    }
  };
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Box>
      <Divider />
      <Box width={"100%"} p={2}>
        <Grid container spacing={2}>
          <Grid
            xs={12}
            sm={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {/* Image */}
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                image={item.image}
                sx={{
                  borderRadius: "8px",
                  objectFit: "cover",
                  width: "100%",
                  height: "100px",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  width: "30%",
                  zIndex: 1,
                }}
              >
                <FoodType foodIndicator={item.indicator} size={16} />
              </Box>
            </Box>
          </Grid>
          <Grid sm={6}>
            {/* Title, Price, Edit, Delete */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Title */}
              <Typography
                variant="h1"
                fontWeight={"xl"}
                sx={{
                  color: theme.palette.text.primary,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title}
              </Typography>
              {/* Price, Edit, Delete */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h1"
                  fontWeight={"xl"}
                  sx={{
                    color: theme.palette.text.currency,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {formatePrice(item.price)}
                </Typography>
                {/* Edit Button */}
                <Button
                  variant="plain"
                  onClick={() => setOpen(true)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  <Typography
                    variant="h1"
                    fontWeight={"xl"}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    <RiPencilLine size={22} />
                  </Typography>
                </Button>
                {/* Delete Button */}
                <Button
                  variant="plain"
                  onClick={() => {
                    Remove_from_offlineCart(item.product_variant_id);
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent",
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
            </Box>
          </Grid>
          <Grid sm={3}>
            {/* Quantity */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormControl size="sm" sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={() =>
                      quantityManage("decrement", item.product_variant_id)
                    }
                    size="sm"
                    variant="outlined"
                    color="neutral"
                  >
                    <RiSubtractFill />
                  </IconButton>
                  <Typography mx={2} sx={{ fontWeight: "xl", fontSize: "lg" }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() =>
                      quantityManage("increment", item.product_variant_id)
                    }
                    size="sm"
                    variant="outlined"
                    color="primary"
                  >
                    <RiAddFill />
                  </IconButton>
                </Box>
              </FormControl>
            </Box>
          </Grid>
          <Grid sm={3}>
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
                {selectedAddons &&
                  selectedAddons?.map((addon, index) => (
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
        </Grid>
      </Box>

      <Divider />
      {open && (
        <CartModel
          OpenDirect={true}
          OnOpen={open}
          onClose={() => {
            setOpen(false);
          }}
          setModalOpen={setOpen}
          variants={item.variants}
          title={item.title}
          image={item.image}
          addons={item.addons}
          rating={item.rating}
          short_description={item.short_description}
          total_allowed_quantity={item.total_allowed_quantity}
          minimum_order_quantity={item.minimum_order_quantity}
          min_max_price={item.min_max_price}
          partner_id={item.partner_id}
          partner_name={item.partner_name}
          no_of_ratings={item?.no_of_ratings}
          is_restro_open={item.is_restro_open}
          selectedAddons={selectedAddons}
          selectedVariantID={item.product_variant_id}
          selectedProductVariantPrice={item.price}
          product_qty={item.qty}
        />
      )}
    </Box>
  );
};

export default OfflineCartItem;
