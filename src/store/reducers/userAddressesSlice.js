import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [], // Initial state with an array of addresses
};

const userAddressesSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setUserAddresses: (state, action) => {
      state.value = action.payload;
    },
    deleteUserAddress: (state, action) => {
      state.value = state.value.filter(address => address.id !== action.payload);
    },
    
  },
});

export const { setUserAddresses, deleteUserAddress } = userAddressesSlice.actions;
export default userAddressesSlice.reducer;
