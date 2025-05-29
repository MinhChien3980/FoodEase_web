import { Box } from "@mui/joy";
import React from "react";
import RazorPay from "../PaymentGateway/RazorPay";
import PayPal from "../PaymentGateway/PayPal";
import Stripe from "../PaymentGateway/Stripe";
import PayStack from "../PaymentGateway/PayStack";
import { useSelector } from "react-redux";
import {
  selectDeliveryAddress,
  selectDeliveryType,
  selectTipAmount,
} from "@/store/reducers/deliveryTipSlice";
import { getUserData } from "@/events/getters";
import FlutterWave from "../PaymentGateway/FlutterWave";
import PhonePe from "../PaymentGateway/PhonePe";
import MidTrans from "../PaymentGateway/MidTrans";

const OnlineMethod = ({
  paymentMethod,
  setCurrentStepIndex,
  loading,
  setLoading,
  is_wallet_used,
  wallet_balance_used,
}) => {
  const UserCart = useSelector((state) => state.cart);
  const Variant_arry = UserCart?.variant_id;
  const variant_id = Variant_arry?.map((item) => item).join(", ");

  const qty = UserCart?.data.map((item) => item.qty).join(", ");

  const final_total = useSelector((state) => state.cart?.totalPayableAmount);

  const delivery_address = useSelector(selectDeliveryAddress);
  const delivery_type = useSelector(selectDeliveryType);

  const is_self_pick_up = delivery_type == "Self-PickUp" ? 1 : 0;

  let promoState = useSelector((state) => state.promoCode)?.value;

  let promoCode = promoState.length > 0 ? promoState[0].promo_code : "";

  let promoCodeDiscount =
    promoState.length > 0 ? promoState[0].final_discount : "";

  const delivery_tip = useSelector(selectTipAmount);

  const userData = getUserData();
  const order_note = localStorage.getItem("orderNote");

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100%"}
    >
      {paymentMethod == "RazorPay" && (
        <RazorPay
          setCurrentStepIndex={setCurrentStepIndex}
          variant_id={variant_id}
          quantity={qty}
          delivery_address={delivery_address}
          final_total={
            is_wallet_used == 1
              ? parseFloat(final_total).toFixed(2) -
                parseFloat(wallet_balance_used).toFixed(2)
              : final_total
          }
          total={UserCart.overall_amount}
          type={"placeOrder"}
          is_self_pick_up={is_self_pick_up}
          promoCode={promoCode}
          promoCodeDiscount={promoCodeDiscount}
          delivery_tip={delivery_tip}
          userData={userData}
          order_note={order_note}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
        />
      )}
      {paymentMethod == "PayPal" && (
        <PayPal
          setCurrentStepIndex={setCurrentStepIndex}
          variant_id={variant_id}
          quantity={qty}
          delivery_address={delivery_address}
          final_total={
            is_wallet_used == 1
              ? parseFloat(final_total).toFixed(2) -
                parseFloat(wallet_balance_used).toFixed(2)
              : final_total
          }
          total={UserCart.overall_amount}
          type={"placeOrder"}
          is_self_pick_up={is_self_pick_up}
          promoCode={promoCode}
          promoCodeDiscount={promoCodeDiscount}
          delivery_tip={delivery_tip}
          userData={userData}
          order_note={order_note}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
        />
      )}
      {paymentMethod == "Stripe" && (
        <Stripe
          setCurrentStepIndex={setCurrentStepIndex}
          variant_id={variant_id}
          quantity={qty}
          delivery_address={delivery_address}
          final_total={
            is_wallet_used == 1
              ? parseFloat(final_total).toFixed(2) -
                parseFloat(wallet_balance_used).toFixed(2)
              : final_total
          }
          total={UserCart.overall_amount}
          type={"placeOrder"}
          is_self_pick_up={is_self_pick_up}
          promoCode={promoCode}
          promoCodeDiscount={promoCodeDiscount}
          delivery_tip={delivery_tip}
          userData={userData}
          order_note={order_note}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
        />
      )}
      {paymentMethod == "FlutterWave" && (
        <FlutterWave
          setCurrentStepIndex={setCurrentStepIndex}
          variant_id={variant_id}
          quantity={qty}
          delivery_address={delivery_address}
          final_total={
            is_wallet_used == 1
              ? parseFloat(final_total).toFixed(2) -
                parseFloat(wallet_balance_used).toFixed(2)
              : final_total
          }
          total={UserCart.overall_amount}
          type={"placeOrder"}
          is_self_pick_up={is_self_pick_up}
          promoCode={promoCode}
          promoCodeDiscount={promoCodeDiscount}
          delivery_tip={delivery_tip}
          userData={userData}
          order_note={order_note}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
        />
      )}
      {paymentMethod == "PayStack" && (
        <PayStack
          setCurrentStepIndex={setCurrentStepIndex}
          variant_id={variant_id}
          quantity={qty}
          delivery_address={delivery_address}
          final_total={
            is_wallet_used == 1
              ? parseFloat(final_total).toFixed(2) -
                parseFloat(wallet_balance_used).toFixed(2)
              : final_total
          }
          total={UserCart.overall_amount}
          type={"placeOrder"}
          is_self_pick_up={is_self_pick_up}
          promoCode={promoCode}
          promoCodeDiscount={promoCodeDiscount}
          delivery_tip={delivery_tip}
          userData={userData}
          order_note={order_note}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
        />
      )}
      {paymentMethod == "Midtrans" && (
        <MidTrans
          setCurrentStepIndex={setCurrentStepIndex}
          variant_id={variant_id}
          quantity={qty}
          delivery_address={delivery_address}
          final_total={
            is_wallet_used == 1
              ? parseFloat(final_total).toFixed(2) -
                parseFloat(wallet_balance_used).toFixed(2)
              : final_total
          }
          total={UserCart.overall_amount}
          type={"placeOrder"}
          is_self_pick_up={is_self_pick_up}
          promoCode={promoCode}
          promoCodeDiscount={promoCodeDiscount}
          delivery_tip={delivery_tip}
          userData={userData}
          order_note={order_note}
          loading={loading}
          setLoading={setLoading}
          is_wallet_used={is_wallet_used}
          wallet_balance_used={wallet_balance_used}
        />
      )}

      {/* <PhonePe
        setCurrentStepIndex={setCurrentStepIndex}
        variant_id={variant_id}
        quantity={qty}
        delivery_address={delivery_address}
        final_total={
          is_wallet_used == 1
            ? parseFloat(final_total).toFixed(2) -
              parseFloat(wallet_balance_used).toFixed(2)
            : final_total
        }
        total={UserCart.overall_amount}
        type={"placeOrder"}
        is_self_pick_up={is_self_pick_up}
        promoCode={promoCode}
        promoCodeDiscount={promoCodeDiscount}
        delivery_tip={delivery_tip}
        userData={userData}
        order_note={order_note}
        loading={loading}
        setLoading={setLoading}
        is_wallet_used={is_wallet_used}
        wallet_balance_used={wallet_balance_used}
      /> */}
    </Box>
  );
};

export default OnlineMethod;
