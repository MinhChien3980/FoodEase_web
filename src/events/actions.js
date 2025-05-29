import { store } from "@/store/store";
import { onCityChange, onLoggedIn } from "@/events/events";
import toast from "react-hot-toast";
import { getUserData, isLogged } from "@/events/getters";
import api, {
  add_to_cart,
  clearCart,
  delete_my_account,
  delete_order,
  get_user_cart,
  register_user,
  sign_up,
  update_fcm,
  userAuth,
  validate_promo_code,
} from "@/interceptor/api";
import {
  setAuth,
  setLogout,
  updateUserInfo,
} from "@/store/reducers/authenticationSlice";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "@/helpers/functionHelpers";
import { getAuth } from "firebase/auth";
import {
  removeFromOfflineCart,
  setCart,
  setCartInitial,
  setOfflineCart,
  setSanckbar,
} from "@/store/reducers/cartSlice";
import { setUserAddresses } from "@/store/reducers/userAddressesSlice";
import { setUserSettings } from "@/store/reducers/userSettingsSlice";
import { setPromoCode } from "@/store/reducers/promoCodeSlice";
import { remove_from_cart, get_address, get_settings } from "@/interceptor/api";
import Router from "next/router";
import * as fbq from "@/lib/fpixel";

export const login = async ({ email, password } = {}) => {
  const res = await userAuth({ email, password });
  if (res.error) return res;
  else {
    store.dispatch(setAuth(res));
    store.dispatch(setUserSettings(res.data));
    localStorage.setItem("user", res.data.id);
    localStorage.setItem("email", res.data.email);
    if (res.token) localStorage.setItem("token", res.token);
    return res;
  }
};
export const OnLoginWithoutNumber = async (
  type = "google",
  userName,
  email,
  mobile,
  photoURL,
  setOpen
) => {
  const res = await sign_up(type, userName, email, mobile, photoURL);
  if (res.error) {
    toast.error(res.message);
    setOpen(false);
    return;
  } else {
    store.dispatch(setAuth(res));
    store.dispatch(setUserSettings(res.data));
    localStorage.setItem("user", res.data.id);
    localStorage.setItem("mobile", res.data.mobile);
    if (res.token) localStorage.setItem("token", res.token);
    setOpen(false);
    return { error: false };
  }
};

export const register = async ({ name, email, mobile, country_code } = {}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("country_code", country_code);
  formData.append("mobile", mobile);
  const res = await register_user({ name, email, mobile, country_code });
  if (res.error) return res;
  else {
    store.dispatch(setAuth(res.data));
    return res;
  }
};

export const logout = async () => {
  try {
    await update_fcm();
    let firebaseConfig = getFirebaseConfig();
    const app = await initializeApp(firebaseConfig);
    const auth = await getAuth(app);
    await auth.signOut();
    await localStorage.removeItem("user");
    await localStorage.removeItem("mobile");
    const city_id = localStorage.getItem("city");
    onCityChange({ city_id });
  } catch (err) {
    console.log(err);
  }
  await Router.push("/home");
  await store.dispatch(setCartInitial(false));
  await store.dispatch(setUserSettings());
  await store.dispatch(setUserAddresses());

  store.dispatch(setLogout(false));
};

export const deleteUserAccount = async () => {
  const response = await delete_my_account();
  if (response.error) {
    toast.error(response.message);
  } else {
    toast.success("Account Deleted Sucessfully");
  }
  await logout();
};
export const updateFCM = async () => {
  const is_logged = store.getState().authentication.isLogged;
  if (is_logged) {
    let fcm_id = localStorage.getItem("fcm_id");
    await update_fcm(fcm_id);
  }
};

export const updateUserAddresses = async () => {
  try {
    const getUserAddresses = await get_address();
    if (!getUserAddresses.error) {
      store.dispatch(setUserAddresses(getUserAddresses.data));
    }
  } catch (error) {
    console.error("failed to load user's addresses", error);
  }
};
export const clearUserCart = async () => {
  try {
    const response = await clearCart();
    if (response.error) {
      toast.error(response.message);
    } else {
      updateUserCart();
      toast.success(response.message);
      let userData = getUserData();
      if (userData) {
        fbq.customEvent("clear-cart", userData);
      }
    }
  } catch (error) {
    // Handle error if clearCart() fails
    console.error(error);
  }
};

export const RemoveCartItem = async (variantID) => {
  const response = await remove_from_cart(variantID);
  if (response.error) {
    toast.error(response.message);
  } else {
    let userData = getUserData();
    if (userData) {
      userData = { ...userData, variantID };
      fbq.customEvent("cart-item-removed", userData);
    }
    updateUserCart();
    toast.success(response.message);
  }
};

export const updateUserCart = async () => {
  try {
    const res = await get_user_cart();
    store.dispatch(setCart(res));
  } catch (error) {
    console.error("error while updating cart:", error);
  }
};

export const updateUserSettings = async () => {
  try {
    if (isLogged()) {
      const settings = await get_settings("all");
      if (!settings.error) {
        store.dispatch(setUserSettings(settings.data.user_data[0]));
      }
    }
  } catch (error) {
    console.error("failed to load updateUserSettings", error);
  }
};

export const deleteItemFromCart = (id) => {
  const state = store.getState();
  const currentCart = state.cart;
};

export const setPageLoader = (state) => {
  store.dispatch(setPageLoader(state));
};

export const findAddonsByVariantId = (variants, productVariantId) => {
  let selectedAddons = [];

  // Iterate through each variant
  variants.forEach((variant) => {
    // Check if the variant has add-ons data
    if (variant.add_ons_data && variant.add_ons_data.length > 0) {
      // Iterate through each add-on data in the variant
      variant.add_ons_data.forEach((addon) => {
        // Check if the product_variant_id matches the provided one
        if (addon.product_variant_id == productVariantId) {
          // Push the matching add-on data to the selectedAddons array
          selectedAddons.push(addon);
        }
      });
    }
  });

  return selectedAddons;
};

// Add Script

export function loadAsyncScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    Object.assign(script, {
      type: "text/javascript",
      async: true,
      src,
    });
    script.addEventListener("load", () => resolve(script));
    document.head.appendChild(script);
  });
}
const payStackSrc = "https://js.paystack.co/v1/inline.js";
export const payStackInit = () => {
  return loadAsyncScript(payStackSrc);
};

export const handleReApplyPromoCode = async () => {
  try {
    setTimeout(async () => {
      try {
        const promoCodeState = store.getState().promoCode.value;
        const overall_amount = store.getState().cart?.overall_amount;

        const response = await validate_promo_code(
          promoCodeState[0].promo_code,
          overall_amount
        );
        if (!response.error) {
          store.dispatch(setPromoCode(response.data));
        } else {
          toast.error(response.message);
          store.dispatch(setPromoCode([]));
        }
      } catch (error) {
        console.error("Error applying promo code:", error);
      }
    }, 500);
  } catch (error) {
    console.error("Error setting up promo code application:", error);
  }
};

//   offline cart
export const store_data = (
  variantId,
  quantity,
  addons_id,
  title,
  item_price,
  image,
  partner_id,
  minimum_order_quantity,
  total_allowed_quantity,
  short_description,
  indicator,
  addons,
  variants,
  rating,
  is_restro_open,
  partner_name,
  min_max_price,
  no_of_ratings
) => {
  const cart_item = {
    image: image,
    title: title,
    price: item_price,
    product_variant_id: variantId,
    qty: quantity,
    addonsId: addons_id,
    partner_id: partner_id,
    minimum_order_quantity: minimum_order_quantity,
    total_allowed_quantity: total_allowed_quantity,
    short_description: short_description,
    indicator: indicator,
    addons: addons,
    variants: variants,
    rating: rating,
    is_restro_open: is_restro_open,
    partner_name: partner_name,
    min_max_price: min_max_price,
    no_of_ratings: no_of_ratings,
  };

  store.dispatch(setOfflineCart(cart_item));
};
export const Remove_from_offlineCart = (product_variant_id) => {
  store.dispatch(removeFromOfflineCart(product_variant_id));
};
export const clearOfflineCart = () => {
  store.dispatch(removeFromOfflineCart("all"));
};

export const sync_offline_cart = async () => {
  let cart_data = store.getState().cart?.offline_cart;

  if (cart_data && cart_data.length != 0) {
    try {
      await Promise.all(
        cart_data.map(async (product, index) => {
          let variant_id = product.product_variant_id;
          let add_on_id = product.addonsId;
          let add_on_qty = product.qty;
          let qty = product.qty;

          const response = await add_to_cart({
            product_variant_id: variant_id,
            qty: qty,
            add_on_id: add_on_id,
            add_on_qty: Array.isArray(qty)
              ? qty.join(",")
              : add_on_id
                  .split(",")
                  .map(() => qty)
                  .join(","),
          });

          // Assuming toast function is available
          if (response.error) {
            toast.error(response.message);
            return;
          } else {
            Remove_from_offlineCart(variant_id);
          }
        })
      );

      updateUserCart();
      clearOfflineCart();
      store.dispatch(setSanckbar(true));
    } catch (error) {
      console.error("Error syncing offline cart:", error);
    }
  }
};
