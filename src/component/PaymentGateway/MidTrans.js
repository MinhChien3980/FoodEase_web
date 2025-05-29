import {
  add_transaction,
  create_midtrans_transaction,
  delete_order,
  place_order,
  get_midtrans_transaction_status,
  midtrans_wallet_transaction,
} from "@/interceptor/api";
import { Button } from "@mui/joy";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createOrderId } from "@/helpers/functionHelpers";
import { useRouter } from "next/router";
import { updateUserCart, updateUserSettings } from "@/events/actions";

const MidTrans = ({
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
  const { t } = useTranslation();
  const router = useRouter();

  const handlePaymentFailure = async (order_id, failureMessage) => {
    if (type === "placeOrder") {
      const deleteResponse = await delete_order(order_id);
      if (!deleteResponse.error) {
        console.log("Order Deleted successfully", deleteResponse.data);
        toast.error(failureMessage);
      }
    } else {
      toast.error(failureMessage);
    }
  };

  const handleUserTransaction = async (order_id, transaction_id) => {
    const response = await add_transaction({
      transaction_type: "transaction",
      order_id,
      type: "midtrans",
      payment_method: "midtrans",
      txn_id: transaction_id,
      amount: final_total,
      status: "Success",
      message: order_note ? order_note : "Transaction Message",
    });

    if (response.error) {
      toast.error(response.message);
      return;
    } else {
      toast.success(response.message);
    }
  };

  const pollPaymentStatus = async (order_id) => {
    const intervalId = setInterval(async () => {
      try {
        let statusResponse;
        if (type == "placeOrder") {
          statusResponse = await get_midtrans_transaction_status(order_id);
        } else {
          statusResponse = await midtrans_wallet_transaction(order_id);
        }
        const { transaction_status, status_code, transaction_id } =
          statusResponse.data;

        if (status_code === "200") {
          toast.success("Payment Successful");

          if (type == "placeOrder") {
            await handleUserTransaction(order_id, transaction_id);
            setCurrentStepIndex(4);
            // Redirect after 5 seconds
            setTimeout(() => {
              router.push("/user/orders");
              updateUserCart();
            }, 5000);
          } else {
            transactionsData();
            handleClose();
            updateUserSettings();
            toast.success("Amount Successfully Credited in your Wallet");
          }

          clearInterval(intervalId);
        } else if (["cancel", "expire"].includes(transaction_status)) {
          const failureMessage =
            transaction_status === "cancel"
              ? "Payment Failed"
              : "Payment Time Expired";

          await handlePaymentFailure(order_id, failureMessage);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error polling payment status:", error);
      }
    }, 5000);
  };

  const makePayment = async () => {
    try {
      setLoading(true);
      let order_id;

      if (type === "placeOrder") {
        const orderResponse = await place_order({
          mobile: userData.mobile,
          product_variant_id: variant_id,
          quantity,
          total,
          final_total,
          latitude: delivery_address?.city_latitude || 0,
          longitude: delivery_address?.city_longitude || 0,
          promo_code: promoCode || "",
          payment_method: "midtrans",
          address_id: delivery_address?.id || 0,
          is_wallet_used,
          wallet_balance_used,
          is_self_pick_up,
          delivery_tip,
          order_note,
          promo_code_discount_amount: promoCodeDiscount,
        });

        if (orderResponse.error) {
          setLoading(false);
          return toast.error(orderResponse.message);
        }

        order_id = orderResponse.order_id;
      } else {
        order_id = createOrderId();
      }

      const transactionResponse = await create_midtrans_transaction(
        final_total,
        order_id
      );

      if (transactionResponse.error) {
        await handlePaymentFailure(order_id, "Payment Failed");
        setLoading(false);
        return;
      }

      const { redirect_url } = transactionResponse.data;
      window.open(redirect_url, "_blank");
      toast.success(
        "Payment page opened in a new tab. Please complete your payment."
      );

      // Start polling for payment status
      pollPaymentStatus(order_id);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An error occurred while processing your payment");
    } finally {
      if (type !== "placeOrder") {
        handleResetWallet();
        setLoading(false);
      }
    }
  };

  return (
    <Button onClick={makePayment} disabled={loading}>
      {loading ? t("please-wait") : t("pay-now")}
    </Button>
  );
};

export default MidTrans;
