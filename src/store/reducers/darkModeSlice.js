// redux/darkModeSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState: {
    value: "light",
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.value = action.payload; // Set dark mode value to payload ("dark" or "light")
    },
  },
});

export const { setDarkMode } = darkModeSlice.actions;

export default darkModeSlice.reducer;
