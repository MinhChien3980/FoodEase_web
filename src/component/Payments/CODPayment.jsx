import { place_order } from "@/interceptor/api";
import {
  selectDeliveryAddress,
  selectDeliveryType,
  selectTipAmount,
} from "@/store/reducers/deliveryTipSlice";
import { Box, Button } from "@mui/joy";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router"; // Importing useRouter from Next.js
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { updateUserCart, updateUserSettings } from "@/events/actions";
import { removePromoCode } from "@/helpers/functionHelpers";

const CODPayment = ({
  setCurrentStepIndex,
  loading,
  setLoading,
  is_wallet_used,
  wallet_balance_used,
}) => {
  const router = useRouter();
  const UserCart = useSelector((state) => state.cart);
  const Variant_arry = UserCart?.variant_id;
  const variant_id = Variant_arry?.map((item) => item).join(", ");

  const qty = UserCart?.data.map((item) => item.qty).join(", ");
  const final_total = useSelector((state) => state.cart?.totalPayableAmount);

  const delivery_address_id = useSelector(selectDeliveryAddress)?.id;
  const deliveryType = useSelector(selectDeliveryType);
  const is_self_pick_up = deliveryType == "Self-PickUp" ? 1 : 0;

  const delivery_tip = useSelector(selectTipAmount);
  const total = UserCart.overall_amount;
  const { t } = useTranslation();

  let promoState = useSelector((state) => state.promoCode)?.value;

  let promo_code = promoState.length > 0 ? promoState[0].promo_code : "";

  let promo_code_discount_amount =
    promoState.length > 0 ? promoState[0].final_discount : "";

  const paymentHandler = () => {
    setLoading(true);
    //API CALL FOR PLACE ORDER
    place_order({
      product_variant_id: variant_id,
      quantity: qty,
      final_total:
        is_wallet_used == 1
          ? parseFloat(final_total).toFixed(2) -
            parseFloat(wallet_balance_used).toFixed(2)
          : final_total,
      total,
      is_wallet_used,
      wallet_balance_used,
      payment_method: "COD",
      active_status: "pending",
      delivery_tip,
      address_id: delivery_address_id,
      is_self_pick_up,
      promo_code,
      notes: localStorage.getItem("orderNote"),
      promo_code_discount_amount,
    })
      .then((response) => {
        setLoading(false);
        if (response.error) {
          removePromoCode();
          toast.error(response.message);
        } else {
          if (is_wallet_used == 1) {
            updateUserSettings();
          }
          setCurrentStepIndex(4);
          toast.success(
            "Order Placed Successfully. It will confirm when partner will accept order. Please, Wait for it!"
          );
          router.push("/user/orders");
          updateUserCart();
        }
      })
      .catch((error) => {
        removePromoCode();
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <Box className="flexProperties" width={"100%"}>
      <Button onClick={paymentHandler} disabled={loading}>
        {loading ? t("please-wait") : t("place-order")}
      </Button>
    </Box>
  );
};

export default CODPayment;
