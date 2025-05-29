import {
  add_to_cart,
  add_transaction,
  delete_order,
  place_order,
  razorpay_create_order,
} from "@/interceptor/api";
import { Button } from "@mui/joy";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { setDeliveryAddress } from "@/store/reducers/deliveryTipSlice";
import { updateUserCart, updateUserSettings } from "@/events/actions";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createOrderId, removePromoCode } from "@/helpers/functionHelpers";
import { useRouter } from "next/navigation";

const RazorPay = ({
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
  const paymentMethods = useSelector((state) => state.settings)?.value
    ?.paymentMethod?.payment_method;
  const keyID = paymentMethods.razorpay_key_id;
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const makePayment = async () => {
    try {
      let ORDER_ID;
      let PlaceOrderResponse;
      setLoading(true);
      if (type == "placeOrder") {
        const response = await place_order({
          mobile: userData.mobile,
          product_variant_id: variant_id,
          quantity,
          total,
          final_total,
          latitude: delivery_address?.city_latitude ?? 0,
          longitude: delivery_address?.city_longitude ?? 0,
          promo_code: promoCode ? promoCode : "",
          payment_method: "razorpay",
          address_id: delivery_address?.id ?? 0,
          is_wallet_used,
          wallet_balance_used,
          is_self_pick_up,
          delivery_tip,
          order_note,
          promo_code_discount_amount: promoCodeDiscount,
        });

        if (response.error) {
          return toast.error(response.message);
        }
        PlaceOrderResponse = response;
        ORDER_ID = response.order_id;
      }
      const order_id = type == "placeOrder" ? ORDER_ID : createOrderId();

      const paymentIntentGenerate = await razorpay_create_order(order_id);

      if (paymentIntentGenerate.error) {
        if (type == "placeOrder") {
          delete_order(order_id).then((response) => {
            if (!response.error) {
              console.log("Order Deleted successfully", response.data);
              toast.error("Payment Failed");
              updateUserCart();
            }
          });
        } else {
          toast.error("Wallet Payment Failed");
        }

        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        let txn_id = "";
        const options = {
          key: keyID,
          amount: final_total * 100, // Amount in paise
          currency: "INR",
          receipt: order_id,
          modal: {
            escape: false,
            ondismiss: function () {
              if (type == "placeOrder") {
                delete_order(order_id).then((response) => {
                  if (!response.error) {
                    console.log("Order Deleted successfully", response.data);
                    updateUserCart();
                    toast.error("Payment Failed");
                  }
                });
              } else {
                toast.error("Payment Failed for Wallet!");
              }
              window.location.reload();
            },
          },
          prefill: {
            contact: userData?.mobile,
            email: userData?.email,
          },
          notes: {
            order_id: order_id,
          },
          handler: async (res) => {
            txn_id = res.razorpay_payment_id;
            const transaction = await add_transaction({
              transaction_type: type == "placeOrder" ? "transaction" : "wallet",
              order_id,
              type: type == "placeOrder" ? "razorpay" : "credit",
              payment_method: "razorpay",
              txn_id: res.razorpay_payment_id,
              amount: final_total,
              status: "Success",
              message: order_note ? order_note : "Transaction Message",
            });
            if (!transaction.error) {
              if (type == "placeOrder") {
                dispatch(setDeliveryAddress());
                setCurrentStepIndex(4);
                toast.success(PlaceOrderResponse.message);
                if (is_wallet_used == 1) {
                  updateUserSettings();
                }
                setTimeout(() => {
                  updateUserCart();
                  window.location.href = "/user/orders";
                }, 2000);
              } else {
                transactionsData();
                updateUserSettings();
                handleClose();
                setLoading(false);
                toast.success("Amount Successfully Credited in your Wallet");
              }
            }
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        // Add event listener for payment failure
        paymentObject.on("paymentFailure", (response) => {
          // console.log("Payment failed:", response);
          console.log("Payment not successfully done");
          // You can add additional error handling logic here if needed
        });
      } else {
        console.error("Razorpay object is not available");
      }
    } catch {
      console.error("Error creating order:");
    } finally {
      setLoading(false);
      if (type != "placeOrder") handleResetWallet();
    }
  };

  return (
    <>
      <Button onClick={makePayment} disabled={loading}>
        {loading ? t("please-wait") : t("pay-now")}
      </Button>
    </>
  );
};

export default RazorPay;
