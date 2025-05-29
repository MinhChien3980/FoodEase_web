import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Typography,
  useTheme,
  Divider,
  Box,
  Checkbox,
  Radio,
  RadioGroup,
  Alert,
} from "@mui/joy";
import ShoppingCart2LineIcon from "remixicon-react/ShoppingCart2LineIcon";
import {
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Slide,
} from "@mui/material";
import { add_to_cart } from "@/interceptor/api";
import toast from "react-hot-toast";
import { store_data, updateUserCart } from "@/events/actions";
import { isLogged } from "@/events/getters";
import {
  RiAddFill,
  RiCloseLine,
  RiErrorWarningFill,
  RiSubtractFill,
} from "@remixicon/react";
import { useTranslation } from "react-i18next";
import {
  updateHomeProducts,
  updateHomeSectionData,
} from "@/repository/home/home_repo";
import RatingStar from "../RatingBox/Rating";
import FoodType from "../FoodType/FoodType";
import { useDispatch } from "react-redux";
import { setSanckbar } from "@/store/reducers/cartSlice";
import { formatePrice, isProductAvailable } from "@/helpers/functionHelpers";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CartModel = ({
  OpenDirect = false,
  is_section_product,
  OnOpen,
  onClose,
  setModalOpen = () => {},
  title = "",
  short_description = "",
  no_of_ratings = "0",
  final_price,
  indicator,
  rating,
  variants,
  min_max_price,
  minimum_order_quantity,
  total_allowed_quantity,
  addons,
  is_restro_open,
  image,
  partner_id = "",
  partner_name = "",
  product_qty = 1,
  type = "",
  currency = "$",
  selectedAddons = [],
  selectedProductVariantPrice = 0,
  selectedVariantID,
  is_initialState = false,
  is_cart_page = false,
  start_time,
  end_time,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState();

  const [selectedProductVariant, setSelectedProductVariant] = useState(0);
  const [singleItemPrice, setSingleItemPrice] = useState(
    variants[0]?.special_price
  );

  const [currentVariant, setCurrentVariant] = useState(variants[0]);
  const [addonsId, setAddOnsId] = useState([]);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [quantity, setQuantity] = useState(product_qty);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const selectedVariant = variants.find(
      (variant) => variant.id === variantId
    );
    setCurrentVariant(selectedVariant);
  }, [variantId, variants]);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  let city_id = localStorage.getItem("city");

  const handleClose = () => {
    setOpen(false);
    setQuantity(1);
  };
  useEffect(() => {
    if (OpenDirect && isLogged() && OnOpen) {
      VariantsOnChange(selectedVariantID, selectedProductVariantPrice);
      if (is_section_product && !is_cart_page) {
        updateHomeSectionData(city_id);
      } else if (!is_cart_page) {
        updateHomeProducts(city_id);
      }
      setOpen(true);
    }
  }, [
    OpenDirect,
    city_id,
    is_section_product,
    selectedProductVariantPrice,
    selectedVariantID,
    OnOpen,
    is_cart_page,
  ]);

  // Decrement quantity
  const handleDecrement = () => {
    if (quantity > minimum_order_quantity) {
      setQuantity((prevCount) => prevCount - 1);
    }
  };

  // Increment quantity
  const handleIncrement = () => {
    if (total_allowed_quantity == "" || quantity < total_allowed_quantity) {
      setQuantity((prevCount) => prevCount + 1);
    } else {
      toast.error(`Maximum ${total_allowed_quantity} items allowed to Add`);
    }
  };

  const VariantsOnChange = (variant_id, price) => {
    setVariantId(variant_id);
    setSingleItemPrice(price);
    setSelectedProductVariant(parseFloat(price));
  };

  useEffect(() => {
    const selectedVariant =
      variantId !== null
        ? variants.find((variant) => variant.id === variantId)
        : variants[0];

    setSelectedProductVariant(
      selectedVariant?.special_price != "0"
        ? selectedVariant?.special_price
        : selectedVariant?.price
    );
  }, [variantId, variants]);

  useEffect(() => {
    setTotalCost(quantity * selectedProductVariant);
  }, [quantity, selectedProductVariant]);

  useEffect(() => {
    const addonsTotalPrice = addonsId.reduce((total, addon) => {
      const addOnItem = addons.find((add) => add.id == addon.add_on_id);
      return total + (addOnItem ? parseInt(addOnItem?.price) * quantity : 0);
    }, 0);

    setTotalCost(quantity * selectedProductVariant + addonsTotalPrice);
  }, [quantity, selectedProductVariant, addonsId, addons]);

  useEffect(() => {
    if (selectedAddons?.length > 0) {
      const initialAddonsTotalPrice = selectedAddons.reduce((total, addon) => {
        return total + parseInt(addon.price) * quantity;
      }, 0);

      setAddOnsId(
        selectedAddons.map((addon) => ({
          add_on_id: addon.id,
        }))
      );
      setTotalCost((prevTotal) => prevTotal + initialAddonsTotalPrice);
    }
  }, [selectedAddons, quantity]);

  const [checkedAddons, setCheckedAddons] = useState(
    new Set(selectedAddons.map((addon) => addon.id))
  );

  const handleInput = (add, add_on_id, isChecked, uncheckAll = false) => {
    if (uncheckAll) {
      setAddOnsId([]);
      setCheckedAddons(new Set()); // Clear all checked add-ons
      setTotalCost(0); // Reset total cost to 0
      return;
    }

    setAddOnsId((prevAddonsId) =>
      isChecked
        ? [...prevAddonsId, { add_on_id }]
        : prevAddonsId.filter(
            (addons_data) => addons_data.add_on_id !== add_on_id
          )
    );

    const addonPrice = parseInt(add.price);

    setTotalCost((total) => {
      if (isChecked) {
        return total + addonPrice * quantity;
      } else {
        return total - addonPrice * quantity;
      }
    });

    setCheckedAddons((prevChecked) => {
      const newChecked = new Set(prevChecked);
      if (isChecked) {
        newChecked.add(add_on_id);
      } else {
        newChecked.delete(add_on_id);
      }
      return newChecked;
    });
  };

  const ManageCart = async (
    variantId,
    quantity,
    addonsId,
    title,
    singleItemPrice,
    image,
    partner_id
  ) => {
    try {
      const addons_id = addonsId.map((item) => item.add_on_id).join(", ");
      setLoading(true);

      if (isLogged()) {
        const response = await add_to_cart({
          product_variant_id: variantId,
          qty: quantity,
          add_on_id: addons_id,
          add_on_qty: Array.isArray(quantity)
            ? quantity.join(",")
            : addons_id
                .split(",")
                .map(() => quantity)
                .join(","),
        });

        // Assuming toast function is available
        if (response.error) {
          toast.error(response.message);
        } else {
          setQuantity(1);
          setOpen(false);
          onClose();
          setModalOpen(false);
          handleInput(null, null, null, true);
          toast.success(response.message);
          if (!is_cart_page) {
            dispatch(setSanckbar(true));
          }
        }
        updateUserCart();
      } else {
        setQuantity(1);
        setOpen(false);

        onClose();
        setModalOpen(false);
        handleInput(null, null, null, true);
        store_data(
          variantId,
          quantity,
          addons_id,
          title,
          singleItemPrice == 0 ? variants[0].price : singleItemPrice,
          image,
          partner_id,
          minimum_order_quantity,
          total_allowed_quantity,
          short_description,
          indicator,
          addons,
          variants,
          rating,
          is_restro_open,
          partner_name,
          min_max_price,
          no_of_ratings
        );
      }
    } catch (error) {
      console.error("Error while adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (timeString = "00:00:00") => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0-23 hours to 1-12 format
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  const isAvailable =
    is_restro_open === "1" && isProductAvailable(start_time, end_time);
  const availabilityHours = `Available between ${formatTime(
    start_time
  )} to ${formatTime(end_time)}`;
  const availabilityMessage =
    is_restro_open === "0"
      ? t("restaurant-closed-text")
      : `${"This Product will be"} ${availabilityHours}`;
  return (
    <>
      <Dialog
        open={OpenDirect ? OnOpen : open}
        onClose={OpenDirect ? onClose : handleClose}
        TransitionComponent={Transition}
        keepMounted
        sx={{ width: "100%" }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className: "borderRadiusMd",
          sx: { width: "100%" },
        }}
        BackdropProps={{
          sx: {
            // backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            borderRadius: "50%",
          }}
        >
          <RiCloseLine />
        </IconButton>
        <DialogContent
          sx={{
            backgroundColor: theme.palette.background.surface,
            padding: 0,
            width: "100%",
          }}
        >
          <Grid
            container
            width={"100%"}
            p={2}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid
              xs={12}
              sm={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "start" },
              }}
            >
              <Box
                sx={{
                  width: { xs: "100px", sm: "120px" },
                  height: { xs: "100px", sm: "120px" },
                  overflow: "hidden",
                  borderRadius: "lg",
                }}
                position="relative"
              >
                <Box
                  component={"img"}
                  src={image}
                  srcSet={`${image} 2x`}
                  loading="lazy"
                  sx={{
                    borderRadius: "lg",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.08)",
                    },
                  }}
                  alt={image}
                  width={"100%"}
                  height={"100%"}
                />
                <Box className="position-absolute" sx={{ top: 8, left: 8 }}>
                  <FoodType foodIndicator={indicator} size={20} />
                </Box>
              </Box>
            </Grid>
            <Grid
              xs={12}
              sm={9}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", sm: "start" },
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Typography
                level="h6"
                sx={{
                  color: theme.palette.primary[600],
                  fontWeight: "md",
                  overflow: "hidden",
                  fontSize: { xs: "lg", md: "xl" },
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: "md",
                  overflow: "hidden",
                  fontSize: "sm",
                }}
              >
                {partner_name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "column",
                  alignItems: { xs: "center", sm: "start" },
                  width: "100%",
                  gap: 1,
                }}
              >
                <RatingStar
                  value={rating}
                  size={20}
                  TotalRaters={no_of_ratings}
                />
                <>
                  {parseFloat(currentVariant?.special_price) > 0 &&
                  parseFloat(currentVariant?.special_price) <
                    parseFloat(currentVariant?.price) ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "start", gap: 1 }}
                    >
                      <Typography
                        level="body6"
                        sx={{
                          color: theme.palette.text.currency,
                          fontWeight: "lg",
                        }}
                      >
                        {formatePrice(
                          parseFloat(currentVariant?.special_price)
                        )}
                      </Typography>
                      <Typography
                        level="body6"
                        sx={{
                          display: "inline-block",
                          fontWeight: "md",
                          textDecoration: "line-through",
                          fontSize: { xs: "sm", sm: "sm" },
                        }}
                      >
                        {formatePrice(parseFloat(currentVariant?.price))}
                      </Typography>

                      <>
                        {parseFloat(currentVariant?.special_price) > 0 &&
                          parseFloat(currentVariant?.special_price) <
                            parseFloat(currentVariant?.price) && (
                            <Box
                              bgcolor={theme.palette.primary[500]}
                              borderRadius={"md"}
                              minWidth={"5%"}
                              className="flexProperties"
                            >
                              <Typography
                                textColor={theme.palette.common.white}
                                sx={{
                                  textAlign: "center",
                                  fontSize: "sm",
                                  padding: 0.1,
                                  paddingX: 1,
                                }}
                              >
                                {Math.round(
                                  ((parseFloat(currentVariant?.price) -
                                    parseFloat(currentVariant?.special_price)) /
                                    parseFloat(currentVariant?.price)) *
                                    100
                                )}
                                % {t("off")}
                              </Typography>
                            </Box>
                          )}
                      </>
                    </Box>
                  ) : (
                    <Typography
                      level="body6"
                      sx={{
                        color: theme.palette.text.currency,
                        fontWeight: "md",
                      }}
                    >
                      {formatePrice(parseFloat(currentVariant?.price))}
                    </Typography>
                  )}
                </>
              </Box>
            </Grid>

            <Grid
              xs={12}
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <FormControl size="sm" sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={handleDecrement}
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

          <Box px={2} width={"100%"}>
            <Typography
              level="h6"
              sx={{
                fontWeight: "xl",
                fontSize: { xs: "md", sm: "lg" },
                textAlign: { xs: "center", sm: "start" },
              }}
            >
              {t("Description")}
            </Typography>

            <Typography
              id="modal-description"
              mb={2}
              sx={{
                maxHeight: "4.5em",
                minHeight: "1em",
                overflowY: "auto",
                lineHeight: "1.5em",
                display: "block",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                wordBreak: "break-word",
                fontSize: { xs: "sm", sm: "md" },
                textAlign: { xs: "center", sm: "start" },
              }}
            >
              {short_description}
            </Typography>
          </Box>
          <DialogContent>
            {currentVariant?.variant_values != "" && (
              <Divider sx={{ width: "100%", marginY: 1 }} />
            )}
            {/* variants data */}
            <Grid container alignItems="center" spacing={1}>
              <Box width={"100%"}>
                {currentVariant?.variant_values != "" ? (
                  <FormControl>
                    <Typography
                      variant="subtitle1"
                      component="h5"
                      textAlign={"center"}
                      color={theme.palette.text.primary}
                    >
                      {currentVariant?.attr_name}
                    </Typography>

                    <Grid
                      container
                      spacing={2}
                      display={"flex"}
                      width={"100%"}
                      alignItems="center"
                    >
                      <Grid xs={6}>
                        {variants.map((variant, index) => {
                          return (
                            <Box key={index}>{variant.variant_values}</Box>
                          );
                        })}
                      </Grid>
                      <Grid xs={6} display={"flex"} justifyContent={"flex-end"}>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          color={theme.palette.primary[500]}
                          defaultValue={
                            OpenDirect
                              ? selectedProductVariantPrice
                              : variants[0].special_price > 0 &&
                                variants[0].special_price < variants[0].price
                              ? variants[0].special_price
                              : variants[0].price
                          }
                        >
                          {variants &&
                            variants.map((variant, index) => {
                              let item_price =
                                parseFloat(variant.special_price) > 0 &&
                                parseFloat(variant.special_price) <
                                  parseFloat(variant.price)
                                  ? parseFloat(variant.special_price)
                                  : parseFloat(variant.price);

                              return (
                                <Box
                                  className="addons-price-wrapper"
                                  key={index}
                                >
                                  <FormControlLabel
                                    value={item_price}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "end",
                                      gap: 1,
                                      color: theme.palette.text.currency,
                                    }}
                                    control={
                                      <Radio
                                        size="md"
                                        color="danger"
                                        checked={variantId == variant.id}
                                        sx={{
                                          padding: 0,
                                        }}
                                      />
                                    }
                                    label={formatePrice(item_price)}
                                    onChange={() =>
                                      VariantsOnChange(variant.id, item_price)
                                    }
                                    labelPlacement="start"
                                  />
                                </Box>
                              );
                            })}
                        </RadioGroup>
                      </Grid>
                    </Grid>
                  </FormControl>
                ) : null}
              </Box>

              <Divider sx={{ width: "100%", marginY: 1 }} />

              {addons && addons?.length != 0 && (
                <>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      component="h5"
                      textAlign={"center"}
                      color={theme.palette.text.primary}
                    >
                      {t("addons")}
                    </Typography>
                  </Box>

                  {addons?.map((add, index) => {
                    const add_on_id = add.id;
                    return (
                      <Box
                        key={index}
                        mb={2}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "97%",
                        }}
                      >
                        <Typography
                          sx={{
                            overflow: "hidden",
                            flex: "1 1 auto",
                          }}
                        >
                          {add.title}
                        </Typography>
                        <FormControlLabel
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            gap: 1,
                            color: theme.palette.text.currency,
                            flex: "0 0 auto",
                          }}
                          control={
                            <Checkbox
                              checked={checkedAddons.has(add_on_id)}
                              onChange={(event) => {
                                const isChecked = event.target.checked;
                                handleInput(add, add_on_id, isChecked);
                              }}
                              variant="soft"
                              color={"danger"}
                              sx={{ padding: "0px" }}
                            />
                          }
                          value={add.price}
                          name="addons"
                          id={add.id}
                          label={`${currency} ${add.price}`}
                          labelPlacement="start"
                        />
                      </Box>
                    );
                  })}
                </>
              )}
            </Grid>

            {isAvailable ? (
              <Box
                mt={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography level="h6" fontWeight={"xl"}>
                    {t("total-amount")}:
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.currency,
                      fontWeight: "xl",
                      fontSize: "xl",
                    }}
                  >
                    {formatePrice(totalCost)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      justifyContent: "start",
                      alignItems: "center",
                    }}
                  >
                    <FormControl size="sm" sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          onClick={handleDecrement}
                          size="sm"
                          variant="outlined"
                          color="neutral"
                        >
                          <RiSubtractFill />
                        </IconButton>
                        <Typography
                          mx={2}
                          sx={{ fontWeight: "xl", fontSize: "lg" }}
                        >
                          {quantity}
                        </Typography>
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
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      sx={{ width: "100%" }}
                      variant="solid"
                      disabled={loading}
                      startDecorator={
                        <ShoppingCart2LineIcon
                          size="18"
                          color={theme.palette.text.white}
                        />
                      }
                      onClick={(e) => {
                        ManageCart(
                          variantId,
                          quantity,
                          addonsId,
                          title,
                          singleItemPrice,
                          image,
                          partner_id
                        );
                      }}
                    >
                      {loading ? t("loading") : t("add-to-cart")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Alert
                startDecorator={<RiErrorWarningFill size={28} />}
                variant="soft"
                color="danger"
                sx={{ marginTop: 2, borderRadius: "xl" }}
              >
                <Typography textAlign={"center"} sx={{ fontWeight: "xl" }}>
                  {availabilityMessage}
                </Typography>
              </Alert>
            )}
          </DialogContent>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartModel;
