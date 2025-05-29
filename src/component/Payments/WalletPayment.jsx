import { updateUserCart, updateUserSettings } from "@/events/actions";
import { place_order } from "@/interceptor/api";
import {
  selectDeliveryAddress,
  selectDeliveryType,
  selectTipAmount,
} from "@/store/reducers/deliveryTipSlice";
import { Box, Button } from "@mui/joy";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const WalletPayment = ({ setCurrentStepIndex, loading, setLoading }) => {
  const { t } = useTranslation();

  const router = useRouter();
  const UserCart = useSelector((state) => state.cart);
  const Variant_arry = UserCart?.variant_id;
  const variant_id = Variant_arry?.map((item) => item).join(", ");

  const qty = UserCart?.data.map((item) => item.qty).join(", ");
  const price = useSelector((state) => state.cart?.totalPayableAmount);

  const delivery_address_id = useSelector(selectDeliveryAddress)?.id;
  const deliveryType = useSelector(selectDeliveryType);
  const is_self_pick_up = deliveryType == "Self-PickUp" ? 1 : 0;

  const delivery_tip = useSelector(selectTipAmount);
  const total = UserCart.overall_amount;

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
      final_total: price,
      total,
      wallet_balance_used: price,
      is_wallet_used: 1,
      payment_method: "wallet",
      active_status: "awaiting",
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
          toast.error(response.message);
        } else {
          setCurrentStepIndex(4);
          toast.success(
            "Order Placed Successfully. It will confirm when partner will accept order. Please, Wait for it!"
          );

          router.push("/user/orders").then(() => {
            updateUserSettings();
            updateUserCart();
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <Box className="flexProperties" width={"100%"}>
      <Button onClick={paymentHandler} disabled={loading}>
        {loading ? t("please-wait") : t("pay-from-wallet")}
      </Button>
    </Box>
  );
};

export default WalletPayment;
