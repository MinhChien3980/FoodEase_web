import { createSlice } from "@reduxjs/toolkit";
import { store } from "../../store";

const initialState = {
  sliders: [],
  sections: [],
  categories: [],
  restaurants: [],
  faqs: [],
  update: false,
  offers: [],
  homeCities: [],
  homeProducts: [],
  allRestaurants: [],
};

const branchSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setHomeSliders: (state, action) => {
      state.sliders = action.payload;
    },
    setHomeSection: (state, action) => {
      state.sections = action.payload;
    },
    setHomeCategories: (state, action) => {
      state.categories = action.payload;
    },
    setHomeOffers: (state, action) => {
      state.offers = action.payload;
    },
    setHomeRestaurants: (state, action) => {
      state.restaurants = action.payload;
    },
    setAllRestaurants: (state, action) => {
      state.allRestaurants = action.payload;
    },
    setHomeFaqs: (state, action) => {
      state.faqs = action.payload;
    },
    setHomeCities: (state, action) => {
      state.homeCities = action.payload;
    },
    setHomeProducts: (state, action) => {
      state.homeProducts = action.payload;
    },
    setFavRestro: (state, action) => {
      const { restaurant } = action.payload;
      const restaurantIndex = state.restaurants.findIndex(
        (r) => r.partner_id == restaurant.partner_id
      );

      if (restaurantIndex != -1) {
        state.restaurants[restaurantIndex] = {
          ...state.restaurants[restaurantIndex],
          is_favorite:
            state.restaurants[restaurantIndex].is_favorite == "1" ? "0" : "1",
        };
      }
    },
    setFavProduct: (state, action) => {
      const { Product } = action.payload;

      const productIndex = state.homeProducts.findIndex(
        (r) => r.id == Product.id
      );
      if (productIndex != -1) {
        state.homeProducts[productIndex] = {
          ...state.homeProducts[productIndex],
          is_favorite:
            state.homeProducts[productIndex].is_favorite == "1" ? "0" : "1",
        };
      }
    },

    setFavSectionProduct: (state, action) => {
      const { Product } = action.payload;
      const sections = state.sections;

      // Iterate through sections
      sections.forEach((section) => {
        // Find the product in product_details
        section.product_details.forEach((product) => {
          if (product.id == Product.id) {
            // Toggle is_favourite value
            product.is_favorite = product.is_favorite == "1" ? "0" : "1";
          }
        });
      });
    },
  },
});

export const {
  setHomeSliders,
  setHomeSection,
  setHomeCategories,
  setHomeOffers,
  setHomeRestaurants,
  setAllRestaurants,
  setHomeFaqs,
  setHomeCities,
  setFavRestro,
  setFavProduct,
  setHomeProducts,
  setFavSectionProduct,
} = branchSlice.actions;

export default branchSlice.reducer;
