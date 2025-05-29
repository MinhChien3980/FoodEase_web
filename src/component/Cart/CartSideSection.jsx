import { Grid } from "@mui/joy";
import React from "react";
import PromoCode from "../PromoCode/PromoCode";
import TipComponent from "./TipComponent";
import AddNote from "./AddNote";

const CartSideSection = ({ deliveryType }) => {
  return (
    <Grid
      container
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={2}
    >
      <Grid xs={12}>
        <PromoCode />
      </Grid>
      <Grid xs={12}>
        <TipComponent deliveryType={deliveryType} />
      </Grid>
      <Grid xs={12}>
        <AddNote />
      </Grid>
    </Grid>
  );
};

export default CartSideSection;
