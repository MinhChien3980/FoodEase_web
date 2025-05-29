import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/joy";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  place_order,
  phonepe_web,
  delete_order,
  add_transaction,
} from "@/interceptor/api";
import { updateUserCart, updateUserSettings } from "@/events/actions";
import { createOrderId } from "@/helpers/functionHelpers";

const PhonePe = ({
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
  const [paymentStatus, setPaymentStatus] = useState(null);
  const { t } = useTranslation();

  const initiatePayment = async () => {
    let orderResponse;
    try {
      setLoading(true);

      if (type == "placeOrder") {
        // Step 1: Place the order first
        orderResponse = await place_order({
          active_status: "draft",
          mobile: userData.mobile,
          product_variant_id: variant_id,
          quantity,
          total,
          final_total,
          latitude: delivery_address?.city_latitude ?? 0,
          longitude: delivery_address?.city_longitude ?? 0,
          promo_code: promoCode ? promoCode : "",
          payment_method: "phonepe",
          address_id: delivery_address?.id ?? 0,
          is_wallet_used,
          wallet_balance_used,
          is_self_pick_up,
          delivery_tip,
          order_note,
          promo_code_discount_amount: promoCodeDiscount,
        });

        if (orderResponse.error) {
          toast.error(orderResponse.message);
          setLoading(false);
          return;
        }
      }

      // Step 2: Initiate PhonePe payment
      const paymentResponse = await phonepe_web({
        order_id:
          type == "placeOrder" ? orderResponse?.order_id : createOrderId(true),
        amount: final_total, // Convert to paise
        type: type == "placeOrder" ? "cart" : "wallet",
        redirect_url: `${window.location.origin}${
          type == "placeOrder" ? "/user/orders" : "/user/wallet"
        }`, // Your callback URL
        mobile: userData.mobile,
      });

      // Step 3: Redirect to PhonePe payment page
      if (paymentResponse.url) {
        window.location.href = paymentResponse.url;
      } else {
        // If no URL is returned, handle the error
        if (type == "placeOrder") {
          await delete_order(orderResponse.order_id);
        }
        toast.error("Payment initiation failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Payment initiation failed");
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={initiatePayment} disabled={loading}>
        {loading ? t("please-wait") : t("pay-now")}
      </Button>
    </div>
  );
};

export default PhonePe;
