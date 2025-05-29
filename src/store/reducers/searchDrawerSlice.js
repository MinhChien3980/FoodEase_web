// searchDrawerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSearchOpen: false,
};

const searchDrawerSlice = createSlice({
  name: "searchDrawer",
  initialState,
  reducers: {
    openSearchDrawer: (state) => {
      state.isSearchOpen = true;
    },
    closeSearchDrawer: (state) => {
      state.isSearchOpen = false;
    },
  },
});

export const { openSearchDrawer, closeSearchDrawer } = searchDrawerSlice.actions;

export default searchDrawerSlice.reducer;
