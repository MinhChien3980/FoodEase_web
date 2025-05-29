import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { HeadTitle } from "@/component/HeadTitle";
import { getUserData, isLogged } from "@/events/getters";
import { useRouter } from "next/router";
import * as fbq from "@/lib/fpixel";

const CartView = dynamic(() => import("@/views/CartView"), {
  ssr: false, // Disable server-side rendering for this component
});
const CartPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!isLogged()) {
      router.push("/home");
    } // eslint-disable-next-line
    else {
      let user_data = getUserData();
      fbq.customEvent("cart-page-view", user_data);
    } // eslint-disable-next-line
  }, []);
  return (
    <div>
      <HeadTitle title={"Cart"} />

      <CartView />
    </div>
  );
};

export default CartPage;
