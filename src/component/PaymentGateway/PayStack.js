import {
  payStackInit,
  updateUserCart,
  updateUserSettings,
} from "@/events/actions";
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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createOrderId } from "@/helpers/functionHelpers";

const PayStack = ({
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
  useEffect(() => {
    payStackInit();
  }, []);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const paymentMethods = useSelector((state) => state.settings)?.value
    ?.paymentMethod?.payment_method;
  const payStackKey = paymentMethods?.paystack_key_id;
  const router = useRouter();

  const makePayment = async (response) => {
    setLoading(true);

    let ORDER_ID;
    let placeOrderResponse;
    if (type == "placeOrder") {
      const response2 = await place_order({
        mobile: userData.mobile,
        product_variant_id: variant_id,
        quantity,
        total,
        final_total,
        latitude: delivery_address?.city_latitude ?? 0,
        longitude: delivery_address?.city_longitude ?? 0,
        promo_code: promoCode || "",
        payment_method: "paystack",
        address_id: delivery_address?.id ?? 0,
        is_wallet_used,
        wallet_balance_used,
        is_self_pick_up,
        delivery_tip,
        order_note,
        promo_code_discount_amount: promoCodeDiscount,
      });

      ORDER_ID = response2.order_id;
      placeOrderResponse = response2;
    }
    if (type == "placeOrder" && placeOrderResponse.error) {
      toast.error(placeOrderResponse.message);
      setLoading(false);
      return;
    }
    const order_id = type == "placeOrder" ? ORDER_ID : createOrderId();

    const handler = window.PaystackPop.setup({
      key: payStackKey, //  your PayStack public key
      email: userData?.email,
      amount: final_total * 100, // Amount in kobo
      currency: "NGN", // currency code
      channels: ["card", "mobile_money", "bank"],
      callback: function (response) {
        try {
          add_transaction({
            transaction_type: type == "placeOrder" ? "transaction" : "wallet",
            order_id,
            type: type == "placeOrder" ? "PayStack" : "credit",
            payment_method: "PayStack",
            txn_id: response.reference, // Corrected reference
            amount: final_total,
            status: "success",
            message: "Transaction Message",
          })
            .then((transactionResponse) => {
              if (transactionResponse.error) {
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
                transactionsData();
                updateUserSettings();
                handleClose();
                handleResetWallet();
                toast.success("Amount Successfully Credited in your Wallet");
              }
            })
            .catch(() => {
              console.error("An error occurred");
              toast.error("An unexpected error occurred.");
              setLoading(false);
            });
        } catch {
          console.error("Payment callback error");
          toast.error("Payment processing failed.");
        }
      },
      onClose: () => {
        // This function is called when the payment window is closed
        if (type === "placeOrder") {
          delete_order(order_id)
            .then((response) => {
              if (!response.error) {
                console.log(response.data);
                return updateUserCart();
              }
              throw new Error("Failed to delete order");
            })
            .then(() => {
              setCurrentStepIndex(1);
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          handleResetWallet();
        }
      },
    });
    handler.openIframe();
  };

  return (
    <>
      <Button onClick={makePayment} disabled={loading}>
        {loading ? t("please-wait") : t("pay-now")}
      </Button>
    </>
  );
};

export default PayStack;
