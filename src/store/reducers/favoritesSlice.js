import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [], // Initial language set to English
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavorites: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
