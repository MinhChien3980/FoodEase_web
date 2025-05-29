import {
  updateHomeProducts,
  updateHomeCategories,
  updateHomeRestaurants,
  updateHomeSlidersData,
  updateHomeOffers,
  updateHomeSectionData,
  HomeCities,
  HomeFaqs,
  AllPartners,
} from "@/repository/home/home_repo";
import { isLogged } from "@/events/getters";
import {
  updateUserCart,
  updateUserAddresses,
  updateUserSettings,
  sync_offline_cart,
} from "@/events/actions";

export const onAppLoad = async () => {
  AllPartners();
  if (isLogged()) {
    updateUserCart(), updateUserAddresses();
    updateUserSettings();
  }
};

export const UpdateHomePageData = async () => {
  let city_id = localStorage.getItem("city");
  onCityChange({ city_id });
};

export const onCityChange = ({ city_id } = {}) => {
  // dont use await for better loading speed
  localStorage.removeItem("city");
  localStorage.setItem("city", city_id);
  updateHomeSlidersData(city_id);
  updateHomeOffers(city_id);
  updateHomeProducts(city_id);
  updateHomeRestaurants(city_id);
  updateHomeCategories(city_id);
  updateHomeSectionData(city_id);
  HomeCities();
  HomeFaqs();
};
export const onLoggedIn = async () => {
  let city_id = localStorage.getItem("city");
  updateHomeProducts(city_id);
  updateHomeRestaurants(city_id);
  updateHomeSectionData(city_id);
  onAppLoad();
  sync_offline_cart();
};
