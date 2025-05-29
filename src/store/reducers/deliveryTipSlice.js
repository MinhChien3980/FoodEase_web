import { createSlice } from "@reduxjs/toolkit";

export const deliveryTipSlice = createSlice({
  name: "deliveryHelper",
  initialState: {
    tipAmount: 0,
    deliveryCharge: [],
    deliveryType: "Delivery",
    deliveryAddress: {},
  },
  reducers: {
    setTipAmount: (state, action) => {
      state.tipAmount = action.payload; // Update the tip amount
    },
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload; // Update Delivery Address
    },
    setDeliveryType: (state, action) => {
      state.deliveryType = action.payload;
    },
    setDeliveryCharge: (state, action) => {
      state.deliveryCharge = action.payload;
    },
  },
});

export const {
  setTipAmount,
  setDeliveryAddress,
  setDeliveryType,
  setDeliveryCharge,
} = deliveryTipSlice.actions;

export const selectTipAmount = (state) => state.deliveryHelper.tipAmount;
export const selectDeliveryAddress = (state) =>
  state.deliveryHelper.deliveryAddress;

export const selectDeliveryType = (state) => state.deliveryHelper.deliveryType;

export default deliveryTipSlice.reducer;
