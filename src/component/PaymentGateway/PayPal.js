"use client";
import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCart, updateUserSettings } from "@/events/actions";
import toast from "react-hot-toast";
import { setDeliveryAddress } from "@/store/reducers/deliveryTipSlice";
import { useRouter } from "next/router";
import {
  add_transaction,
  delete_order,
  place_order,
  add_to_cart,
} from "@/interceptor/api";
import { Box, CircularProgress, Typography, useTheme } from "@mui/joy";
import { removePromoCode } from "@/helpers/functionHelpers";

const PayPal = ({
  variant_id,
  quantity,
  delivery_address,
  final_total,
  total,
  type,
  is_self_pick_up,
  promoCode,
  delivery_tip,
  userData,
  order_note,
  setCurrentStepIndex,
  handleClose,
  transactionsData,
  loading,
  setLoading,
  handleResetWallet,
  is_wallet_used,
  wallet_balance_used,
  promoCodeDiscount,
}) => {
  const dispatch = useDispatch();
  const paymentMethods = useSelector((state) => state.settings)?.value
    ?.paymentMethod?.payment_method;
  const keyID = paymentMethods?.paypal_client_id;
  const paypalCurrency = paymentMethods?.currency_code;

  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    if (error != null) {
      toast.error(error);
    }
  }, [error]);

  const createOrder = (data, actions) => {
    if (is_self_pick_up == 0) {
      toast.error("Please select Address");
      return;
    }

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: final_total,
            currency_code: paypalCurrency,
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      setLoading(true);
      setPaidFor(true);

      if (type == "wallet") {
        const transaction = await add_transaction({
          transaction_type: "wallet",
          order_id: details.id,
          type: "credit",
          payment_method: "paypal",
          txn_id: details.id,
          amount: final_total,
          status: details.status,
          message: "Transaction Message",
        });
        if (transaction.error) {
          toast.error(transaction.message);
          setLoading(false);
        } else {
          updateUserSettings();
          transactionsData();
          handleClose();
          toast.success("Amount Successfully Credited in your Wallet");
          setLoading(false);
        }
      } else {
        const placeOrderResponse = await place_order({
          mobile: userData.mobile,
          product_variant_id: variant_id,
          quantity,
          total,
          delivery_tip,
          active_status: "awaiting",
          final_total,
          latitude: delivery_address?.city_latitude ?? 0,
          longitude: delivery_address?.city_longitude ?? 0,
          promo_code: promoCode,
          payment_method: "paypal",
          address_id: delivery_address?.id ?? 0,
          is_wallet_used,
          wallet_balance_used,
          is_self_pick_up,
          promo_code_discount_amount: promoCodeDiscount,
        });

        if (!placeOrderResponse.error) {
          const transaction = await add_transaction({
            transaction_type: "transaction",
            order_id: placeOrderResponse.order_id,
            type: "paypal",
            payment_method: "paypal",
            txn_id: details.id,
            amount: final_total,
            status: details.status,
            message: order_note ? order_note : "Transaction Message",
          });

          if (transaction.error) {
            toast.error(transaction.message);
            delete_order(order_id).then((response) => {
              if (response.error) {
                toast.error(response.message);
              } else {
                toast.error("Payment Cancelled by user !");
                setLoading(false);
              }
            });
            updateUserCart();
            setCurrentStepIndex(1);
            setLoading(false);
          } else {
            setLoading(false);
            if (is_wallet_used == 1) {
              updateUserSettings();
            }
            setCurrentStepIndex(4);
            toast.success(placeOrderResponse.message);
            dispatch(setDeliveryAddress());
            setTimeout(() => {
              router
                .push("/user/orders")
                .then(() => {
                  updateUserCart();
                })
                .catch((error) => {
                  console.error("Navigation to orders page failed:", error);
                });
            }, 2000);
          }
        } else {
          setLoading(false);
          toast.error(placeOrderResponse.message);
        }
      }
    } catch {
      setError("Something went wrong when completing the payment");
      console.log("Error");
    } finally {
      if (type != "placeOrder") handleResetWallet();
      setLoading(false);
    }
  };

  const onError = () => {
    removePromoCode();
    setError("An error occurred while processing the payment");
    console.log("Error");
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        width: "100% !important",
      }}
    >
      <PayPalScriptProvider options={{ "client-id": keyID }}>
        {!paidFor && keyID && (
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            style={{
              disableMaxWidth: true,
              layout: "vertical",
              shape: "pill",
              label: "pay",
              height: 55,
            }}
          />
        )}
        <Box sx={{ width: "100%" }}>
          {paidFor && <div>Thank you for your payment!</div>}
          {/* {error && <Box sx={{ color: "red", marginLeft: "10px" }}>{error}</Box>} */}
        </Box>
      </PayPalScriptProvider>

      {loading && (
        <Box
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography
            sx={{
              color: theme.palette.text.primary,
              fontWeight: "md",
              fontSize: { xs: "md", md: "xl" },
            }}
          >
            Payment is Processing Please Wait..!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PayPal;
