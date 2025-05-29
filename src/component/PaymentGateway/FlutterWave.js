import { updateUserCart, updateUserSettings } from "@/events/actions";
import { createOrderId } from "@/helpers/functionHelpers";
import {
  add_to_cart,
  add_transaction,
  delete_order,
  place_order,
} from "@/interceptor/api";
import { setDeliveryAddress } from "@/store/reducers/deliveryTipSlice";
import { Button } from "@mui/joy";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

const FlutterWave = ({
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
  is_wallet_used,
  wallet_balance_used,
  handleResetWallet,
  promoCodeDiscount,
}) => {
  const paymentMethods = useSelector((state) => state.settings)?.value
    ?.paymentMethod?.payment_method;
  const flutterWavePublishableKey = paymentMethods?.flutterwave_public_key;
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const makePayment = async () => {
    setLoading(true);
    let placeOrderResponse;
    let ORDER_ID;
    try {
      if (type == "placeOrder") {
        const response = await place_order({
          mobile: userData.mobile,
          product_variant_id: variant_id,
          quantity,
          total,
          final_total,
          latitude: delivery_address?.city_latitude ?? 0,
          longitude: delivery_address?.city_longitude ?? 0,
          promo_code: promoCode || "",
          payment_method: "flutterWave",
          address_id: delivery_address?.id ?? 0,
          is_wallet_used,
          wallet_balance_used,
          is_self_pick_up,
          delivery_tip,
          order_note,
          promo_code_discount_amount: promoCodeDiscount,
        });
        if (response.error) {
          console.error("Order placement failed:", response.error);
          toast.error("Order placement failed.");
          setLoading(false);
          return;
        }
        placeOrderResponse = response;
        ORDER_ID = response.order_id;
      }

      const order_id = type == "placeOrder" ? ORDER_ID : createOrderId();

      window.FlutterwaveCheckout({
        public_key: flutterWavePublishableKey,
        tx_ref: "titanic-48981487343MDI0NzMx",
        amount: final_total,
        currency: "NGN",
        payment_options: "card, mobilemoneyghana, ussd",
        callback: async function (payment) {
          if (
            payment.status === "successful" ||
            payment.status === "completed"
          ) {
            try {
              const transactionResponse = await add_transaction({
                transaction_type:
                  type == "placeOrder" ? "transaction" : "wallet",
                order_id,
                type: type == "placeOrder" ? "FlutterWave" : "credit",
                payment_method: "FlutterWave",
                txn_id: payment.transaction_id, // Corrected reference
                amount: final_total,
                status: "Success",
                message: "Transaction Message",
              });

              if (transactionResponse.error) {
                if (type == "placeOrder") {
                  delete_order(order_id).then((response) => {
                    if (response.error) {
                      toast.error(response.message);
                    } else {
                      toast.error("Payment Cancelled by user !");
                      setLoading(false);
                    }
                  });
                } else {
                  toast.error("Payment Failed");
                }
                console.error(
                  "Transaction logging failed:",
                  transactionResponse.error
                );
                toast.error("Transaction logging failed.");
                setLoading(false);
                return;
              }
              if (type == "placeOrder") {
                dispatch(setDeliveryAddress());
                setCurrentStepIndex(4);
                if (is_wallet_used == 1) {
                  updateUserSettings();
                }
                setLoading(false);
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
                updateUserSettings()
                  .then(() => {
                    handleClose();
                    setLoading(false);
                  })
                  .then(() => {
                    transactionsData();
                    toast.success(
                      "Amount Successfully Credited in your Wallet"
                    );
                  })
                  .catch((error) => {
                    // console.error("An error occurred:", error);
                    // Handle any errors here
                  });
              }
            } catch (error) {
              // console.error("Payment callback error:", error);
              toast.error("Payment processing failed.");
            } finally {
              setLoading(false);
              if (type != "placeOrder") {
                handleResetWallet();
              }
            }
          }
        },
        onclose: function (incomplete) {
          if (incomplete) {
            if (type == "placeOrder") {
              // Handle incomplete payment scenario
              delete_order(order_id).then((response) => {
                if (response.error) {
                  toast.error(response.message);
                } else {
                  toast.error("Payment Cancelled by user !");
                  setLoading(false);
                }
              });

              updateUserCart();
            }
          } else {
            toast.success("Payment has been done Sucessfully !");
          }
        },
        customer: {
          email: userData?.email,
          phone_number: userData?.mobile,
          name: userData?.username,
        },
      });
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Order placement failed.");
      setLoading(false);
    } finally {
      if (type != "placeOrder") {
        handleResetWallet();
      }
    }
  };

  return (
    <Button onClick={makePayment} disabled={loading}>
      {loading ? t("please-wait") : t("pay-now")}
    </Button>
  );
};

export default FlutterWave;
