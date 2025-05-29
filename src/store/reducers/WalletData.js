import { createSelector, createSlice } from "@reduxjs/toolkit";

let initialState = {
  wallet: [],
};
const WalletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallet: (state, action) => {
      state.wallet = action.payload;
      return state;
    },
  },
});

export const { setWallet } = WalletSlice.actions;
export default WalletSlice.reducer;
