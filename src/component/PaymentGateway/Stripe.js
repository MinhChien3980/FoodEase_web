"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress, useTheme } from "@mui/joy";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

import { updateUserCart, updateUserSettings } from "@/events/actions";
import { setDeliveryAddress } from "@/store/reducers/deliveryTipSlice";
import {
  add_transaction,
  delete_order,
  payment_intent,
  place_order,
  add_to_cart,
} from "@/interceptor/api";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { createOrderId } from "@/helpers/functionHelpers";

const Stripe = ({
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
  transactionsData,
  handleClose,
  loading,
  setLoading,
  handleResetWallet,
  wallet_amount = 0,
  is_wallet_used,
  wallet_balance_used,
  promoCodeDiscount,
}) => {
  const paymentMethods = useSelector((state) => state.settings)?.value
    ?.paymentMethod?.payment_method;
  const stripePublishableKey = paymentMethods.stripe_publishable_key;

  const stripePromise = loadStripe(stripePublishableKey);

  return (
    <Box my={4} sx={{ width: "100%", maxWidth: "500px" }}>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          variant_id={variant_id}
          quantity={quantity}
          delivery_address={delivery_address}
          final_total={final_total}
          total={total}
          type={type}
          is_self_pick_up={is_self_pick_up}
          promoCode={promoCode}
          delivery_tip={delivery_tip}
          userData={userData}
          order_note={order_note}
          setCurrentStepIndex={setCurrentStepIndex}
          transactionsData={transactionsData}
          handleClose={handleClose}
          loading={loading}
          setLoading={setLoading}
          handleResetWallet={handleResetWallet}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
          wallet_amount={wallet_amount}
          promoCodeDiscount={promoCodeDiscount}
        />
      </Elements>
    </Box>
  );
};
const CheckoutForm = ({
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
  transactionsData,
  handleClose,
  loading,
  setLoading,
  handleResetWallet,
  is_wallet_used,
  wallet_balance_used,
  wallet_amount,
  promoCodeDiscount,
}) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme();

  const DeleteOrderHandler = async (order_id) => {
    const response = await delete_order(order_id);
    if (!response.error) {
      console.log("Order deleted successfully", response.data);
    } else {
      console.error("Failed to delete order:", response.error);
      toast.error("Failed to delete order: " + response.error.message);
    }
    updateUserCart();
    setCurrentStepIndex(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded correctly.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    let placeOrderResponse;
    let ORDER_ID;
    try {
      const { paymentMethod, error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentMethodError) {
        // console.error("Payment method creation failed:", paymentMethodError);
        toast.error("Payment method creation failed.");
        setLoading(false);
        return;
      }

      if (type == "placeOrder") {
        const response = await place_order({
          mobile: userData.mobile,
          product_variant_id: variant_id,
          quantity,
          total,
          final_total,
          active_status: "awaiting",
          latitude: delivery_address?.city_latitude ?? 0,
          longitude: delivery_address?.city_longitude ?? 0,
          promo_code: promoCode || "",
          payment_method: "stripe",
          address_id: delivery_address?.id ?? 0,
          is_wallet_used,
          wallet_balance_used,
          is_self_pick_up,
          delivery_tip,
          order_note,
          promo_code_discount_amount: promoCodeDiscount,
        });

        if (response.error) {
          console.error("Order placement failed:", placeOrderResponse.error);
          toast.error("Order placement failed.");
          setLoading(false);
          return;
        } else {
          placeOrderResponse = response;
          ORDER_ID = response.order_id;
        }
      }

      const order_id = type == "placeOrder" ? ORDER_ID : createOrderId();
      const paymentIntentResponse = await payment_intent({
        order_id,
        type: "stripe",
        wallet_amount,
      });
      if (paymentIntentResponse.error) {
        console.error(
          "Payment intent creation failed:",
          paymentIntentResponse.error
        );
        toast.error("Payment Failed");

        if (type == "placeOrder") {
          await DeleteOrderHandler(order_id);
        }
        setLoading(false);

        return;
      }

      const { error: confirmError, paymentIntent: confirmedPaymentIntent } =
        await stripe.confirmCardPayment(
          paymentIntentResponse.data.client_secret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: userData?.username,
              },
            },
          }
        );
      if (confirmError) {
        try {
          if (type == "placeOrder") {
            await DeleteOrderHandler(order_id);
            toast.error("Payment Failed");
            setLoading(false);
            return;
          }
        } catch (deleteError) {
          console.error("Error deleting order:", deleteError);
          toast.error("Error deleting order: " + deleteError.message);
        }

        // console.error("Payment confirmation failed:", confirmError);
        toast.error("Payment confirmation failed: " + confirmError.message);
        setLoading(false);
        return;
      }

      const transactionResponse = await add_transaction({
        transaction_type: type == "placeOrder" ? "transaction" : "wallet",
        order_id,
        type: type == "placeOrder" ? "stripe" : "credit",
        payment_method: "stripe",
        txn_id: confirmedPaymentIntent.id,
        amount: final_total,
        status: "success",
        message: "Transaction Message",
      });

      if (transactionResponse.error) {
        console.error("Transaction logging failed:", transactionResponse.error);
        toast.error("Transaction logging failed.");
        setLoading(false);
        return;
      }

      if (type == "placeOrder") {
        setCurrentStepIndex(4);
        if (is_wallet_used == 1) {
          updateUserSettings();
        }
        dispatch(setDeliveryAddress());
        toast.success(placeOrderResponse.message);
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
      } else {
        updateUserSettings();
        transactionsData();
        handleClose();
        toast.success("Amount Successfully Credited in your Wallet");
      }
    } catch (error) {
      console.error("An error occurred while processing the payment:", error);
      toast.error(
        "An error occurred while processing the payment:",
        error.message
      );
      if (type == "placeOrder" && ORDER_ID) {
        await DeleteOrderHandler(ORDER_ID);
        updateUserCart();
      }
    }

    setLoading(false);
    if (type != "placeOrder") {
      handleResetWallet();
    }
  };
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px", // Increase the font size
        padding: "8px 12px", // Add padding
        color: theme.palette.mode === "dark" ? "white" : "black",

        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, monospace",
        fontWeight: "500",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "red",
      },
    },
  };
  return (
    <Box sx={{ width: "100%" }}>
      <CardElement className="stripe" options={cardElementOptions} />
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={1}
      >
        <Button
          color="primary"
          sx={{ width: "100%" }}
          disabled={loading || !stripe}
          onClick={handleSubmit}
          startDecorator={loading ? <CircularProgress size="sm" /> : null}
        >
          {loading ? t("please-wait") : t("pay-now")}
        </Button>
      </Box>
    </Box>
  );
};

export default Stripe;
