import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isWalletUsed: [],
};
const WalletSlice = createSlice({
  name: "walletPayment",
  initialState,
  reducers: {
    setWalletUsed: (state, action) => {
      state.isWalletUsed = action.payload;
      return state;
    },
  },
});

export const { setWalletUsed } = WalletSlice.actions;
export default WalletSlice.reducer;
