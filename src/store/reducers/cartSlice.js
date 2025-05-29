import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  total_quantity: 0,
  sub_total: 0,
  tax_percentage: 0,
  tax_amount: 0,
  overall_amount: 0,
  total_arr: 0,
  variant_id: [],
  data: [],
  offline_cart: [],
  snackbar: false,
  isDrawerOpen: false,
  totalPayableAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setSanckbar: (state, action) => {
      state.snackbar = action.payload;
    },
    setDrawerOpen(state, action) {
      state.isDrawerOpen = action.payload;
    },
    setCart: (state, action) => {
      state.total_quantity = action.payload.total_quantity;
      state.sub_total = action.payload.sub_total;
      state.tax_percentage = action.payload.tax_percentage;
      state.tax_amount = action.payload.tax_amount;
      state.overall_amount = action.payload.overall_amount;
      state.total_arr = action.payload.total_arr;
      state.variant_id = action.payload.variant_id;
      state.data = action.payload.data;
      state.totalPayableAmount = action.payload.overall_amount;
    },
    setTotalPayableAmount: (state, action) => {
      state.totalPayableAmount = action.payload;
    },
    setCartInitial: (state) => {
      state.total_quantity = initialState.total_quantity;
      state.sub_total = initialState.sub_total;
      state.tax_percentage = initialState.tax_percentage;
      state.tax_amount = initialState.tax_amount;
      state.overall_amount = initialState.overall_amount;
      state.total_arr = initialState.total_arr;
      state.variant_id = initialState.variant_id;
      state.data = initialState.data;
      state.snackbar = initialState.snackbar;
      state.totalPayableAmount = initialState.totalPayableAmount;
    },
    setOfflineCart: (state, action) => {
      const newItem = action.payload;
      // If the cart is empty, simply push the new item
      if (state.offline_cart.length === 0) {
        state.offline_cart.push(newItem);
        toast.success("Successfully Added to cart !");
        return;
      }

      // Check if the new item's partner_id matches existing items' partner_id
      const existingPartnerId = state.offline_cart[0].partner_id;
      if (newItem.partner_id !== existingPartnerId) {
        toast.error(
          "only items from one restaurant at a time are allowed in cart."
        );
        return;
      }

      // Check if the new item already exists in the cart
      const existingIndex = state.offline_cart.findIndex(
        (item) => item.product_variant_id === newItem.product_variant_id
      );

      if (existingIndex !== -1) {
        // If an item with the same product_variant_id exists, replace it
        state.offline_cart[existingIndex] = newItem;
      } else {
        // If no item with the same product_variant_id exists, push the new item
        state.offline_cart.push(newItem);
      }
      toast.success("Successfully Added to cart !");
    },

    updateCartOfflineItem: (state, action) => {
      const { product_variant_id, updates } = action.payload;
      const itemIndex = state.offline_cart.findIndex(
        (item) => item.product_variant_id === product_variant_id
      );
      if (itemIndex !== -1) {
        state.offline_cart[itemIndex] = {
          ...state.offline_cart[itemIndex],
          ...updates,
        };
      }
      // toast.success("Successfully Added to cart !");
    },

    removeFromOfflineCart: (state, action) => {
      const product_variant_id = action.payload;
      if (product_variant_id === "all") {
        state.offline_cart = [];
      } else {
        state.offline_cart = state.offline_cart.filter(
          (item) => item.product_variant_id !== product_variant_id
        );
        toast.error("Successfully Removed from cart !");
      }
    },
  },
});

export const {
  setCart,
  setCartInitial,
  setOfflineCart,
  setSanckbar,
  setTotalPayableAmount,
  setDrawerOpen,
  removeFromOfflineCart,
  updateCartOfflineItem,
} = cartSlice.actions;

export default cartSlice.reducer;
