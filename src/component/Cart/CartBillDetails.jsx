import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Box,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/joy";
import { RiArticleLine, RiMoneyDollarCircleLine } from "@remixicon/react";
import {
  selectDeliveryType,
  selectTipAmount,
  setDeliveryCharge,
} from "@/store/reducers/deliveryTipSlice";
import { setTotalPayableAmount } from "@/store/reducers/cartSlice";
import { get_delivery_charges } from "@/interceptor/api";
import { formatePrice } from "@/helpers/functionHelpers";

const CartBillDetails = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();

  // Selectors
  const DeliveryType = useSelector(selectDeliveryType);
  const tipAmount = useSelector(selectTipAmount);
  const cartStoreData = useSelector((state) => state.cart);
  const finalTotal = useSelector((state) => state.cart?.totalPayableAmount);
  const promoCode = useSelector((state) => state.promoCode.value);
  const deliveryAddress = useSelector(
    (state) => state.deliveryHelper.deliveryAddress
  );

  // Local state
  const [tip, setTip] = useState(0);
  const [addressId, setAddressId] = useState(null);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);

  // Memoized calculations
  const totalPayableAmount = useMemo(() => {
    const baseAmount = cartStoreData?.overall_amount || 0;
    const promoDiscount = promoCode?.[0]?.final_discount || 0;
    const tipValue = Number(tip) || 0;

    return promoCode?.length > 0
      ? baseAmount - promoDiscount + tipValue
      : baseAmount + tipValue;
  }, [cartStoreData?.overall_amount, promoCode, tip]);

  // Handle tip changes based on delivery type
  useEffect(() => {
    setTip(DeliveryType === "Delivery" ? tipAmount : 0);
  }, [DeliveryType, tipAmount]);

  // Handle address changes
  useEffect(() => {
    if (deliveryAddress?.id) {
      setAddressId(deliveryAddress.id);
    }
  }, [deliveryAddress]);

  // Store total payable amount
  // useEffect(() => {
  //   localStorage.setItem("totalPayableAmount", totalPayableAmount);
  // }, [totalPayableAmount]);

  // Update total payable amount with delivery charges
  useEffect(() => {
    let total = parseFloat(totalPayableAmount) || 0;
    if (DeliveryType === "Delivery" && !isFreeDelivery) {
      total += parseFloat(deliveryCharges) || 0;
    }

    dispatch(setTotalPayableAmount(total));
  }, [
    tip,
    promoCode,
    deliveryCharges,
    DeliveryType,
    isFreeDelivery,
    dispatch,
    cartStoreData.overall_amount,
  ]);

  // Fetch delivery charges
  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      if (
        DeliveryType !== "Delivery" ||
        !addressId ||
        !cartStoreData?.overall_amount
      ) {
        setIsFreeDelivery(false);
        setDeliveryCharges(0);
        return;
      }

      try {
        const response = await get_delivery_charges({
          address_id: addressId,
          final_total: cartStoreData.overall_amount,
        });

        if (!response) return;

        dispatch(setDeliveryCharge(response));
        setIsFreeDelivery(response.is_free_delivery === "1");
        setDeliveryCharges(parseInt(response.delivery_charge || 0));
      } catch (error) {
        console.error("Error fetching delivery charges:", error);
        setIsFreeDelivery(false);
        setDeliveryCharges(0);
      }
    };

    fetchDeliveryCharges();
  }, [DeliveryType, cartStoreData.overall_amount, addressId, dispatch]);

  return (
    <Grid
      xs={12}
      sx={{ width: "100%", backgroundColor: theme.palette.background.surface }}
    >
      <Box sx={{ borderRadius: "sm" }} className="boxShadow" p={2}>
        {/* Bill Details Header */}
        <CardActions sx={{ pt: 0, gap: 1 }}>
          <RiArticleLine
            color={
              theme.palette.mode === "light"
                ? theme.palette.text.menuText
                : theme.palette.text.currency
            }
          />
          <Typography
            variant="h1"
            fontWeight="xl"
            sx={{ color: theme.palette.text.primary }}
          >
            {t("bill-details")}
          </Typography>
        </CardActions>

        <CardContent sx={{ px: { md: 2, xs: 1 } }}>
          <Divider sx={{ my: 1 }} />

          {/* Sub Total */}
          <Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                textColor={
                  theme.palette.mode === "light"
                    ? "text.menuText"
                    : "text.secondary"
                }
                fontWeight="md"
                sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
              >
                {t("sub-total")}
              </Typography>
              <Typography
                textColor="text.currency"
                fontWeight="lg"
                sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
              >
                {formatePrice(cartStoreData?.sub_total || 0)}
              </Typography>
            </Box>

            {/* Taxes and Charges */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                textColor={
                  theme.palette.mode === "light"
                    ? "text.menuText"
                    : "text.secondary"
                }
                fontWeight="md"
                sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
              >
                {t("taxes-and-charges")}
              </Typography>
              <Typography
                textColor="text.currency"
                fontWeight="lg"
                sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
              >
                {formatePrice(cartStoreData?.tax_amount || 0)}
              </Typography>
            </Box>

            {/* Tip Section */}
            {tip > 0 && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
                  textColor={
                    theme.palette.mode === "light"
                      ? "text.menuText"
                      : "text.secondary"
                  }
                  fontWeight="md"
                >
                  {t("Tip-Delivery-Boy")}
                </Typography>
                <Typography
                  textColor="text.currency"
                  fontWeight="lg"
                  sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
                >
                  {formatePrice(Number(tip))}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Delivery Charges Section */}
          {DeliveryType === "Delivery" && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                textColor={
                  theme.palette.mode === "light"
                    ? "text.menuText"
                    : "text.secondary"
                }
                fontWeight="md"
              >
                {t("delivery-charges")}
              </Typography>

              {isFreeDelivery ? (
                <Box display="flex" alignItems="center">
                  <Typography
                    textColor="success.main"
                    fontWeight="lg"
                    mr={1}
                    sx={{ color: theme.palette.text.currency }}
                  >
                    {t("free")}
                  </Typography>
                  <Typography
                    textColor="text.currency"
                    fontWeight="lg"
                    sx={{ textDecoration: "line-through" }}
                  >
                    {formatePrice(deliveryCharges)}
                  </Typography>
                </Box>
              ) : (
                <Typography textColor="text.currency" fontWeight="lg">
                  {formatePrice(deliveryCharges)}
                </Typography>
              )}
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Total */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              textColor={
                theme.palette.mode === "light"
                  ? "text.menuText"
                  : "text.secondary"
              }
              fontWeight="lg"
              sx={{ fontSize: { xs: "sm", sm: "md", md: "lg" } }}
            >
              {t("total")}
            </Typography>
            <Typography
              textColor="text.currency"
              fontWeight="lg"
              sx={{ fontSize: { xs: "sm", sm: "md", md: "lg" } }}
            >
              {formatePrice(
                parseFloat(finalTotal) +
                  parseFloat(promoCode?.[0]?.final_discount || 0)
              )}
            </Typography>
          </Box>

          <Divider
            sx={{
              my: 1,
              borderStyle: "dotted",
              borderWidth: "0.1px",
              height: "0.1px",
              opacity: 0.5,
            }}
          />

          {/* Promo Code Discount */}
          {promoCode?.length > 0 && (
            <>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  textColor={
                    theme.palette.mode === "light"
                      ? "text.menuText"
                      : "text.secondary"
                  }
                  fontWeight="md"
                  sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
                >
                  {t("promoCode-discount")}
                </Typography>
                <Typography
                  textColor="text.currency"
                  fontWeight="lg"
                  sx={{ fontSize: { xs: "xs", sm: "sm", md: "md" } }}
                >
                  -{formatePrice(promoCode[0]?.final_discount || 0)}
                </Typography>
              </Box>
              <Divider sx={{ mt: 1 }} />
            </>
          )}
        </CardContent>

        {/* Total Payable */}
        <CardActions
          orientation="horizontal"
          sx={{ justifyContent: "space-between", pr: 2 }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <RiMoneyDollarCircleLine
              color={
                theme.palette.mode === "light"
                  ? theme.palette.text.menuText
                  : theme.palette.text.currency
              }
            />
            <Typography
              variant="h1"
              fontWeight="xl"
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: "sm", sm: "md", md: "lg" },
              }}
            >
              {t("total-payable")}
            </Typography>
          </Box>
          <Typography
            fontSize="md"
            fontWeight="lg"
            textColor="text.currency"
            sx={{ fontSize: { xs: "md", md: "lg" } }}
          >
            {formatePrice(finalTotal)}
          </Typography>
        </CardActions>
      </Box>
    </Grid>
  );
};

export default CartBillDetails;
