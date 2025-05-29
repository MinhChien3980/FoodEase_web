import { createSelector, createSlice } from "@reduxjs/toolkit";

let initialState = {
  faqs: [],
};
const FaqsSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {
    setFaqs: (state, action) => {
      state.faqs = action.payload;
      return state;
    },
  },
});

export const { setFaqs } = FaqsSlice.actions;
export default FaqsSlice.reducer;
