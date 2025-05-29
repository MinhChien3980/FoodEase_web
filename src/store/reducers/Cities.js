import { createSelector, createSlice } from "@reduxjs/toolkit";

let initialState = {
  cities: [],
};
const CitySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setCities: (state, action) => {
      state.cities = action.payload;
      return state;
    },
  },
});

export const { setCities } = CitySlice.actions;
export default CitySlice.reducer;
