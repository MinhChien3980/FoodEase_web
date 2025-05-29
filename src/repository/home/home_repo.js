import api, {
  getOffers,
  get_cities,
  get_faqs,
  get_partners,
  get_products,
  get_sections,
  get_sliders,
} from "@/interceptor/api";
import { store } from "@/store/store";
import {
  setHomeSliders,
  setHomeSection,
  setHomeCategories,
  setHomeOffers,
  setHomeRestaurants,
  setHomeFaqs,
  setHomeCities,
  setHomeProducts,
  setAllRestaurants,
} from "@/store/reducers/Home/homeSlice";
import { navigateErrorPage } from "@/helpers/functionHelpers";
import { get_categories } from "@/interceptor/api";

export const updateHomeSlidersData = async (city_id) => {
  try {
    const res = await get_sliders(city_id);
    if (res.error) {
      console.error("Error while updating sliders:", res.data);
      return; // Exit the function after logging the error
    }
    store.dispatch(setHomeSliders(res.data));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

export const updateHomeSectionData = async (city_id) => {
  try {
    const res = await get_sections({ city_id });
    if (res.data.error) {
      console.error("Error while updating sections:", res.data);
      return; // Exit the function after logging the error
    }
    store.dispatch(setHomeSection(res.data));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};
export const updateHomeOffers = async (city_id) => {
  try {
    const res = await getOffers({ city_id });
    if (res.data.error) {
      console.error("Error while updating offers:", res.data);
      return; // Exit the function after logging the error
    }
    store.dispatch(setHomeOffers(res.data));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

export const updateHomeProducts = async (city_id) => {
  try {
    const form = new FormData();
    form.append("city_id", city_id);
    form.append("limit", 10);
    // form.append("top_rated_foods", 1);

    const res = await get_products(form);

    if (res.data.error) {
      console.error("Error while updating Products:", res.data);
      return; // Exit the function after logging the error
    }
    store.dispatch(setHomeProducts(res.data));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

export const updateHomeCategories = async (city_id) => {
  try {
    const res = await get_categories({ city_id });

    if (res.data.error) {
      console.error("Error while updating categories:", res.data);
      return; // Exit the function after logging the error
    }
    store.dispatch(setHomeCategories(res.data));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

export const updateHomeRestaurants = async (city_id) => {
  try {
    const res = await get_partners({
      limit: 10,
      offset: 0,
      top_rated_partner: 0,
      city_id, // Include city_id in the request payload
    });

    if (res.data.error) {
      console.error("Error while updating Restaurants:", res.data);
      return; // Exit the function after logging the error
    }
    store.dispatch(setHomeRestaurants(res.data));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

export const HomeFaqs = async () => {
  try {
    const res = await get_faqs();
    if (res.data.error) {
      console.error("Error while updating home Faqs:", res.data);
      return; // Exit the function after logging the error
    }
    store.dispatch(setHomeFaqs(res.data));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

export const HomeCities = async () => {
  try {
    const res = await get_cities();
    if (res.data.error) {
      console.error("Error while updating home cities:", res.data);
      return; // Exit the function after logging the error
    }
    store.dispatch(setHomeCities(res.data));
  } catch (error) {
    console.error("An unexpected error occurred:", error);
  }
};

export const AllPartners = async () => {
  try {
    const res = await get_partners({ all_partner: true });
    if (res.error) {
      console.error("Error fetching All Partners");
    } else {
      store.dispatch(setAllRestaurants(res.data));
    }
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }
};
////////////////////////////////////////////////////////////////
