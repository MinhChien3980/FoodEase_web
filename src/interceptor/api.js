import { logout } from "@/events/actions";
import { store } from "@/store/store";
import axios from "axios";
import { toast } from "react-hot-toast";
import * as fbq from "@/lib/fpixel";
import { getUserData } from "@/events/getters";
import { removePromoCode } from "@/helpers/functionHelpers";

const url = process.env.NEXT_PUBLIC_API_URL;
const apiUrl = url.replace(/"/g, "");
const demoMOde = process.env.NEXT_APP_DEMO_MODE;

// API Routes

const LOGIN = "login";
const UPDATE_USER = "update_user";
const VERIFY_USER = "verify_user";
const REGISTER_USER = "register_user";
const GET_OFFERS = "get_offer_images";
const GET_SLIDERS = "get_slider_images";
const GET_CATEGORIES = "get_categories";
const GET_RESTAURANTS = "get_partners";
const GET_PRODUCTS = "get_products";
const GET_ADDRESS = "get_address";
const ADD_ADDRESS = "add_address";
const DELETE_ADDRESS = "delete_address";
const UPDATE_ADDRESS = "update_address";

const IS_CITY_DELIVERABLE = "is_city_deliverable";
const ADD_TO_CART = "manage_cart";
const GET_USER_CART = "get_user_cart";
const GET_SETTINGS = "get_settings";
const GET_FAVORITES = "get_favorites";
const ADD_TO_FAVORITES = "add_to_favorites";
const REMOVE_FROM_FAVORITES = "remove_from_favorites";
const GET_LANGUAGES = "get_languages";
const PAYMENT_INTENT = "payment_intent";
const GET_ORDERS = "get_orders";
const PLACE_ORDER = "place_order";
const ADD_TRANSACTION = "add_transaction";
const TRANSACTIONS = "transactions";
const ORDER_STATUS = "update_order_status";
const REMOVE_FROM_CART = "remove_from_cart";
const GET_SECTIONS = "get_sections";
const GET_CITIES = "get_cities";
const GET_FAQS = "get_faqs";
const RAZORPAY_CREATE_ORDER = "razorpay_create_order";
const FLUTTERWAVE = "flutterwave_webview";
const FLUTTERWAVE_RESPONSE = "flutterwave_payment_response";
const DELIVERY_CHARGE = "get_delivery_charges";
// const CART_SYNC = "cart_sync";
const DELETE_ORDER = "delete_order";
const SIGN_UP = "sign_up";
const GET_PROMO_CODE = "get_promo_codes";
const VALIDATE_CODE = "validate_promo_code";
const MANAGE_CART = "manage_cart";
const SETPHONEPE = "phonePe";
const SETORDERRATING = "set_order_rating";
const SETPRODUCTRATING = "set_product_rating";
const SETRIDERRATING = "set_rider_rating";
const SENWITHDRWALREQUEST = "send_withdrawal_request";
const RESEND_OTP = "resend_otp";
const VERIFY_OTP = "verify_otp";
const GET_LIVE_TRACKING_DETAILS = "get_live_tracking_details";
const DELETE_MY_ACCOUNT = "delete_my_account";
const REORDER = "re_order";
const UPDATE_FCM = "update_fcm";
const GET_NOTIFICATION = "get_notifications";
const CREATE_MIDTRANS_TRANSACTION = "create_midtrans_transaction";
const GET_MIDTRANS_TRANSACTION_STATUS = "get_midtrans_transaction_status";
const MIDTRANS_WALLET_TRANSACTION = "midtrans_wallet_transaction";
const PHONEPE_WEB = "phonepe_web";
const GET_RESTAURANTS_ALL = "restaurants/all";
const GET_MENU_ITEMS_ALL = "menu-items/all";
const GET_MENU_ITEMS_BY_RESTAURANT = "menu-items/by-restaurant";

let isHandlingUnauthorized = false; // Flag to prevent multiple retries

axios.interceptors.response.use(
  function (response) {
    // Return the response if it's successful
    return response;
  },
  function (error) {
    let response;
    if (error.response && error.response.status === 401) {
      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        handleUnauthorizedAccess();
      }
      response = {
        data: {
          error: true,
          message: "Unauthorized access. Please log in again.",
          data: [],
        },
      };

      return response;
    }

    // Reject the promise for other errors
    return Promise.reject(error.response || error);
  }
);

//Handle user unauthorized when token is expire (401 error)
function handleUnauthorizedAccess() {
  toast.error("Unauthorized access. Please log in again.");
  setTimeout(async () => {
    await logout();
  }, 2000);
}
//  axios interceptor
// Add request interceptor

axios.interceptors.request.use(
  async function (config) {
    const token = store.getState()?.authentication?.accessToken;

    config.url = `${apiUrl}` + config.url;

    Object.assign(config.headers, {
      Authorization: `Bearer ${token}`,
    });

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//get user from localstorage

const getUser = () => {
  let user = localStorage.getItem("user");

  if (user) {
    try {
      return parseInt(user);
    } catch (error) {
      return false;
    }
  }
  return false;
};

//get latitude and longitude from localStorage
const getlatlang = () => {
  const state = store.getState();
  const geolatitude = state.selectedCity.value.lat;
  const geolongitude = state.selectedCity.value.lng;
  return { latitude: geolatitude, longitude: geolongitude };
};

//login
export async function userAuth({ email, password }) {
  try {
    const response = await fetch("http://localhost:8080/api/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.code === 200 && result.data?.authenticated) {
      return {
        error: false,
        token: result.data.token,
        data: {
          email,
          username: email // or get from API if available
        }
      };
    } else {
      return { error: true, message: "Invalid email or password" };
    }
  } catch (err) {
    return { error: true, message: "Network error" };
  }
}

//verify user
export const verify_user = async ({ mobile }) => {
  const formData = new FormData();

  formData.append("mobile", mobile);

  const response = await axios.post(VERIFY_USER, formData);

  return response.data;
};
//resend otp
export async function resend_otp(phoneWithoutCountry) {
  const formData = new FormData();
  let mobileData = parseInt(phoneWithoutCountry);
  formData.append("mobile", mobileData);

  let response = await axios.post(RESEND_OTP, formData);

  return response.data;
}

//verify Otp
export async function verify_otp({ phoneWithoutCountry, verificationCode }) {
  //form data have otp(user entered) and user mobile number
  const formData = new FormData();
  formData.append("mobile", phoneWithoutCountry);
  formData.append("otp", verificationCode);
  let response = await axios.post(VERIFY_OTP, formData);

  return response.data;
}

//update user
export const update_user = async ({
  username = "",
  mobile = "",
  email = "",
  image = "",
  address = "",
  city_id = "",
  referral_code = "",
}) => {
  let id = getUser();
  let location = getlatlang();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("username", username);
  formData.append("mobile", mobile);
  formData.append("email", email);
  formData.append("image", image);
  formData.append("address", address);
  if (typeof location != "undefined") {
    if (typeof location.latitude != "undefined") {
      formData.append("latitude", location.latitude);
    }
    if (typeof location.longitude != "undefined") {
      formData.append("longitude", location.longitude);
    }
  }
  formData.append("city_id", city_id);
  formData.append("referral_code", referral_code);

  const response = await axios.post(UPDATE_USER, formData);

  return response.data;
};

//register user

export const register_user = async ({
  name,
  email,
  mobile = "",
  country_code = 91,
  referral_code = "",
  fcm_id = "",
  friends_code = "",
  latitude = "",
  longitude = "",
  type = "",
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("mobile", mobile);
  formData.append("country_code", country_code);
  if (referral_code != null) {
    formData.append("referral_code", referral_code);
  }
  formData.append("fcm_id", fcm_id);
  formData.append("friends_code", friends_code);
  if (latitude != null) {
    formData.append("latitude", latitude);
  }
  if (longitude != null) {
    formData.append("longitude", longitude);
  }
  formData.append("type", type);

  const response = await axios.post(REGISTER_USER, formData);

  return response.data;
};

// Delete User

export const delete_my_account = async () => {
  let user_id = getUser();
  const formData = new FormData();
  if (user_id) {
    formData.append("user_id", user_id);
  }
  let response = await axios.post(DELETE_MY_ACCOUNT, formData);

  if (response.status === 200) {
    fbq.customEvent("account-deleted", { user_id });
  }
  return response.data;
};

export const update_fcm = async (fcm_id = "") => {
  let user_id = getUser();
  const formData = new FormData();
  if (user_id) {
    formData.append("user_id", user_id);
  }

  formData.append("web_fcm_id", fcm_id);

  try {
    let response = await axios.post(UPDATE_FCM, formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//get offers
export const getOffers = async ({ offset = 0, limit = 6, city_id }) => {
  let location = getlatlang();
  const formData = new FormData();
  if (typeof location !== "undefined") {
    if (typeof location.latitude !== "undefined") {
      formData.append("latitude", location.latitude);
    }
    if (typeof location.longitude !== "undefined") {
      formData.append("longitude", location.longitude);
    }
  }
  if (city_id !== undefined) {
    formData.append("city_id", city_id);
  }

  // Append offset and limit to formData
  formData.append("offset", offset);
  formData.append("limit", limit);

  let response = await axios.post(GET_OFFERS, formData);

  return response.data;
};

//get sliders
export const get_sliders = async (city_id) => {
  const formData = new FormData();
  if (city_id !== undefined) {
    formData.append("city_id", city_id);
  }
  let response = await axios.post(GET_SLIDERS, formData);

  return response.data;
};

// get_categories
export const get_categories = async ({
  partner_slug = "",
  limit,
  offset,
  city_id,
}) => {
  const formData = new FormData();
  let location = getlatlang();
  formData.append("partner_slug", partner_slug);
  if (city_id !== undefined) {
    formData.append("city_id", city_id);
  }

  if (typeof location !== "undefined") {
    if (typeof location.latitude !== "undefined") {
      formData.append("latitude", location.latitude);
    }
    if (typeof location.longitude !== "undefined") {
      formData.append("longitude", location.longitude);
    }
  }

  formData.append("limit", limit ?? 10);
  formData.append("offset", offset ?? 0);
  formData.append("web", true);
  let response = await axios.post(GET_CATEGORIES, formData);
  return response.data;
};

// get_partners

export const get_partners = async ({
  slug = "",
  partner_id = "",
  // city_id,
  vegetarian = "",
  top_rated_partner = 0,
  limit = 20,
  offset = 0,
  sort = "",
  order = "",
  only_opened_partners = "",
  all_partner = false,
}) => {
  let location = getlatlang();
  let city_id = localStorage.getItem("city");
  let id = getUser();
  const formData = new FormData();
  formData.append("slug", slug);
  formData.append("id", partner_id);

  formData.append("city_id", city_id);
  id ? formData.append("user_id", id) : formData.append("user_id", "");
  formData.append("vegetarian", vegetarian);
  formData.append("limit", limit);
  formData.append("offset", offset);
  formData.append("sort", sort);
  formData.append("order", order);
  formData.append("top_rated_partner", top_rated_partner);
  formData.append("only_opened_partners", only_opened_partners);

  if (typeof location != "undefined") {
    if (typeof location.latitude != "undefined") {
      formData.append(
        "latitude",
        demoMOde === "true" ? "23.2419997" : location.latitude
      );
    }
    if (typeof location.longitude != "undefined") {
      formData.append(
        "longitude",
        demoMOde === "true" ? "69.6669324" : location.longitude
      );
    }
  }
  let response;
  if (all_partner) {
    response = await axios.post(GET_RESTAURANTS);
  } else {
    response = await axios.post(GET_RESTAURANTS, formData);
  }

  return response.data;
};

// get_products

export const get_products = async (formData) => {
  try {
    const location = getlatlang();
    const id = getUser();
    const requestData = {
      id: formData.get("product_id") || "",
      category_slug: formData.get("category_slug") || "",
      category_id: formData.get("category_id") || "",
      user_id: id || "",
      search: formData.get("search") || "",
      slug: formData.get("slug") || "",
      tags: formData.get("tags") || "",
      highlights: formData.get("highlights") || "",
      attribute_value_ids: formData.get("attribute_value_ids") || "",
      limit: formData.get("limit") || "",
      offset: formData.get("offset") || "",
      sort: formData.get("sort") || "",
      order: formData.get("order") || "",
      top_rated_foods: formData.get("top_rated_foods") || "",
      discount: formData.get("discount") || "",
      min_price: formData.get("min_price") || "",
      max_price: formData.get("max_price") || "",
      partner_id: formData.get("partner_id") || "",
      product_variant_ids: formData.get("product_variant_ids") || "",
      vegetarian: formData.get("vegetarian") || "",
      filter_by: formData.get("filter_by") || "",
      latitude: location && location.latitude ? location.latitude : "",
      longitude: location && location.longitude ? location.longitude : "",
      city_id: formData.get("city_id") || localStorage.getItem("city"),
      partner_slug: formData.get("partner_slug") || "",
    };

    // Create a new FormData object
    const form2 = new FormData();

    // Iterate over requestData object and append each key-value pair to form2
    for (const key in requestData) {
      if (requestData.hasOwnProperty(key)) {
        form2.append(key, requestData[key]);
      }
    }

    const response = await axios.post(GET_PRODUCTS, form2);

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// get_address

export const get_address = async (addr_id = "") => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("address_id", addr_id);

  try {
    const response = await axios.post(GET_ADDRESS, formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// add_address

export const add_address = async ({
  mobile,
  adds,
  area,
  city,
  landmark,
  latitude,
  longitude,
  address_type = "home",
  is_default = 0,
}) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("mobile", mobile);
  formData.append("address", adds);
  formData.append("area", area);
  formData.append("city", city);
  formData.append("landmark", landmark);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append("type", address_type);
  formData.append("is_default", is_default);

  const response = await axios.post(ADD_ADDRESS, formData);
  return response.data;
};

// delete_address
export const delete_address = async (id) => {
  const formData = new FormData();
  formData.append("id", id);
  const response = await axios.post(DELETE_ADDRESS, formData);
  return response.data;
};

// update_address
export const update_address = async ({
  address_id = "",
  mobile = "",
  add = "",
  area = "",
  city = "",
  landmark = "",
  type = "home",
  pincode = "370001",
  latitude = Number(process.env.NEXT_PUBLIC_LATITUDE),
  longitude = Number(process.env.NEXT_PUBLIC_LONGITUDE),
  is_default = 0,
}) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("id", address_id);
  formData.append("user_id", id);
  formData.append("mobile", mobile);
  formData.append("address", add);
  formData.append("area", area);
  formData.append("city", city);
  formData.append("type", type);
  formData.append("landmark", landmark);
  formData.append("pincode", pincode);
  formData.append("longitude", longitude);
  formData.append("latitude", latitude);
  formData.append("is_default", is_default);
  const response = await axios.post(UPDATE_ADDRESS, formData);
  return response.data;
};

// is_city_deliverable

export const is_city_deliverable = async (name) => {
  const formData = new FormData();
  formData.append("name", demoMOde === "true" ? "bhuj" : name);

  const response = await axios.post(IS_CITY_DELIVERABLE, formData);
  return response.data;
};

//add to cart

export const add_to_cart = async ({
  product_variant_id = "",
  qty = 1,
  clear_cart = "",
  is_saved_for_later = "",
  add_on_id = "",
  add_on_qty = "",
}) => {
  let id = getUser();

  const formData = new FormData();
  id ? formData.append("user_id", id) : formData.append("user_id", "");
  formData.append("product_variant_id", product_variant_id);
  formData.append("qty", qty);

  if (clear_cart != null) {
    formData.append("clear_cart", clear_cart);
  }
  if (is_saved_for_later != null) {
    formData.append("is_saved_for_later", is_saved_for_later);
  }

  if (add_on_id != null) {
    formData.append("add_on_id", add_on_id);
  }
  if (add_on_qty != null) {
    formData.append("add_on_qty", add_on_qty);
  }

  try {
    const response = await axios.post(ADD_TO_CART, formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//get user cart

export const get_user_cart = async (is_saved_for_later = null) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);

  if (is_saved_for_later !== null) {
    formData.append("is_saved_for_later", is_saved_for_later);
  }

  try {
    const response = await axios.post(GET_USER_CART, formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// get_favorites

export const get_favorites = async ({ type, limit = "60", offset = "0" }) => {
  const formData = new FormData();
  let id = getUser();
  formData.append("user_id", id);
  formData.append("type", type);
  formData.append("limit", limit);
  formData.append("offset", offset);

  try {
    const response = await axios.post(GET_FAVORITES, formData);
    return response.data;
  } catch (error) {
    console.log(error);
    // throw error; // Rethrow the error to propagate it further if needed
  }
};

// add_to_favorites

export const add_to_favorites = async ({ type, type_id }) => {
  const formData = new FormData();
  let id = getUser();
  formData.append("user_id", id);
  formData.append("type", type);
  formData.append("type_id", type_id);

  try {
    const response = await axios.post(ADD_TO_FAVORITES, formData);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
};

// remove_from_favorites

export const remove_from_favorites = async ({ type, type_id }) => {
  const formData = new FormData();
  let id = getUser();
  formData.append("user_id", id);
  formData.append("type", type);
  formData.append("type_id", type_id);

  try {
    const response = await axios.post(REMOVE_FROM_FAVORITES, formData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// get_languages

export const get_languages = async () => {
  const response = await axios.post(GET_LANGUAGES);
  return response.data;
};

// payment_intent

export const payment_intent = async ({ order_id, type, wallet_amount = 0 }) => {
  const formData = new FormData();
  formData.append("order_id", order_id);
  if (wallet_amount > 0) {
    formData.append("amount", wallet_amount);
  }
  formData.append("type", type);
  const response = await axios.post(PAYMENT_INTENT, formData);
  return response.data;
};

// get_orders

export const get_orders = async (
  order_id = "",
  limit = "",
  offset = "",
  active_status = ""
) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("id", order_id);
  formData.append("limit", limit);
  formData.append("offset", offset);
  if (active_status) formData.append("active_status", active_status);

  try {
    const response = await axios.post(GET_ORDERS, formData);
    // Handle successful response here
    return response.data;
  } catch (error) {
    // Handle error here
    console.log(error);
  }
};

// place_order

export const place_order = async ({
  product_variant_id,
  quantity,
  final_total,
  total,
  is_wallet_used,
  payment_method,
  active_status = "awaiting",
  address_id = "",
  delivery_tip = "",
  is_self_pick_up = "",
  wallet_balance_used = 0,
  notes = null,
  promo_code = "",
  promo_code_discount_amount = "",
}) => {
  let id = getUser();
  let mobile = getUserData().mobile;
  let location = getlatlang();
  let deliveryChargeState = store.getState().deliveryHelper?.deliveryCharge;
  let cartState = store.getState().cart;
  let selectedAddress = store.getState()?.deliveryHelper?.deliveryAddress;
  let latitude = selectedAddress?.latitude;
  let longitude = selectedAddress?.longitude;

  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("mobile", mobile);
  formData.append("product_variant_id", product_variant_id);
  formData.append("quantity", quantity);

  formData.append("final_total", Number(final_total).toFixed(2));
  formData.append("total", total);
  formData.append("tax_amount", cartState.tax_amount);
  formData.append("tax_percentage", cartState.tax_percentage);
  promo_code_discount_amount;

  if (deliveryChargeState && is_self_pick_up == 0) {
    formData.append(
      "delivery_charge",
      deliveryChargeState.is_free_delivery == "0"
        ? deliveryChargeState.delivery_charge
        : ""
    );
  }

  formData.append("is_wallet_used", is_wallet_used);

  formData.append("promo_code", promo_code);
  // formData.append("promo_code_discount_amount", promo_code_discount_amount);

  formData.append(
    "wallet_balance_used",
    is_wallet_used ? wallet_balance_used : ""
  );

  if (notes !== null) {
    formData.append("order_note", notes);
  }

  formData.append("payment_method", payment_method);
  formData.append("active_status", active_status);
  formData.append("address_id", address_id);
  if (delivery_tip != 0) {
    formData.append("delivery_tip", delivery_tip);
  }
  formData.append("is_self_pick_up", is_self_pick_up);
  if (is_self_pick_up === 1) {
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
  } else {
    formData.append("latitude", latitude ?? "");
    formData.append("longitude", longitude ?? "");
  }

  try {
    const response = await axios.post(PLACE_ORDER, formData);
    if (response.status === 200 && response.data.error === false) {
      fbq.customEvent("order-place", {
        order_id: response.data.order_id,
        product_variant_id,
        quantity,
        final_total,
        total,
        is_wallet_used,
        payment_method,
        active_status,
        address_id,
        delivery_tip,
        is_self_pick_up,
        wallet_balance_used,
        notes,
        promo_code,
      });
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// add_transaction

export const add_transaction = async ({
  transaction_type = "transaction",
  order_id,
  type,
  payment_method,
  txn_id,
  amount,
  status,
  message,
}) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("transaction_type", transaction_type);
  formData.append("order_id", order_id);
  formData.append("type", type);
  formData.append("payment_method", payment_method);
  formData.append("txn_id", txn_id);
  formData.append("amount", amount);
  formData.append("status", status);
  formData.append("message", message);
  if (payment_method == "paypal" || payment_method == "stripe")
    formData.append("skip_verify_transaction", true);

  const response = await axios.post(ADD_TRANSACTION, formData);
  return response.data;
};

// transactions

export const transactions = async ({
  limit,
  offset,
  search,
  transaction_type,
}) => {
  const formData = new FormData();
  let id = getUser();
  formData.append("user_id", id);
  formData.append("limit", limit);
  formData.append("offset", offset);
  formData.append("transaction_type", transaction_type);
  if (search !== null) formData.append("search", search);

  const response = await axios.post(TRANSACTIONS, formData);
  return response.data;
};

// update_order_status

export const update_order_status = async (status, order_id, reason) => {
  const formData = new FormData();
  formData.append("status", status);
  formData.append("order_id", order_id);
  formData.append("reason", reason);

  const response = await axios.post(ORDER_STATUS, formData);
  return response.data;
};

// remove_from_cart

export const remove_from_cart = async (product_variant_id = "") => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("product_variant_id", product_variant_id);

  const response = await axios.post(REMOVE_FROM_CART, formData);
  return response.data;
};

// clear_cart

export const clearCart = async () => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);

  const response = await axios.post(REMOVE_FROM_CART, formData);
  return response.data;
};

// get_sections

export const get_sections = async ({
  city_id = "",
  section_id = "",
  slug = "",
}) => {
  let id = getUser();

  const formData = new FormData();
  formData.append("user_id", id || "");
  formData.append("section_slug", slug || "");

  if (section_id != undefined) {
    formData.append("section_id", section_id);
  }
  formData.append("city_id", city_id);
  const response = await axios.post(GET_SECTIONS, formData);
  return response.data;
};

// GET_CITIES

export const get_cities = async () => {
  return {
    data: [
      { id: 1, name: "Mock City", latitude: "0", longitude: "0" }
    ]
  };
};
// GET_FAQS

export const get_faqs = async () => {
  const response = await axios.post(GET_FAQS);
  return response.data;
};
// RAZORPAY_CREATE_ORDER

export const razorpay_create_order = async (order_id) => {
  const formData = new FormData();
  formData.append("order_id", order_id);
  const response = await axios.post(RAZORPAY_CREATE_ORDER, formData);
  return response.data;
};

// flutterwave webview

export const flutterwave_webview = async (price) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("amount", price);

  const response = await axios.post(FLUTTERWAVE, formData);
  return response.data;
};

// flutterwave_payment_response

export const flutterwave_payment_response = async () => {
  const response = await axios.post(FLUTTERWAVE_RESPONSE);
  return response.data;
};

// delivery_charge

export const get_delivery_charges = async ({
  address_id = 0,
  final_total = 0,
}) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  if (address_id && address_id !== 0) formData.append("address_id", address_id);
  formData.append("final_total", final_total);

  const response = await axios.post(DELIVERY_CHARGE, formData);
  return response.data;
};

// delivery_charge

export const cart_sync = async (data) => {
  const formData = new FormData();
  let id = getUser();
  formData.append("user_id", id);
  formData.append("data", data);

  const response = await axios.post(ADD_TO_CART, formData);
  return response.data;
};

//re order
export const re_order = async (order_id) => {
  const formData = new FormData();
  formData.append("order_id", order_id);

  const response = await axios.post(REORDER, formData);
  return response.data;
};

// delete order

export const delete_order = async (order_id) => {
  const formData = new FormData();
  formData.append("order_id", order_id);
  const response = await axios.post(DELETE_ORDER, formData);
  removePromoCode();
  return response.data;
};

// sign_up

export const sign_up = async (type, name, email, mobile = false, photoURL) => {
  let fcm_id = localStorage.getItem("fcm_id");
  const formData = new FormData();
  formData.append("type", type);
  formData.append("name", name);
  formData.append("email", email);
  if (fcm_id) {
    formData.append("web_fcm_id", fcm_id);
  }
  if (mobile) {
    formData.append("mobile", mobile);
  }
  if (photoURL) {
    formData.append("user_profile", photoURL);
  }

  const response = await axios.post(SIGN_UP, formData);
  return response.data;
};

// get_promo_codes

export const get_promo_codes = async (partner_id) => {
  const formData = new FormData();

  formData.append("partner_id", partner_id);

  const response = await axios.post(GET_PROMO_CODE, formData);

  return response.data;
};

// validate_code

export const validate_promo_code = async (promo_code, final_total) => {
  const formData = new FormData();
  let id = getUser();
  formData.append("user_id", id);
  formData.append("promo_code", promo_code);
  formData.append("final_total", final_total);

  const response = await axios.post(VALIDATE_CODE, formData);
  return response.data;
};

// settings api calling
export const settingsAPI = (type) => {
  const formData = new FormData();
  let id = getUser();
  formData.append("type", type);
  if (id !== false) {
    formData.append("user_id", id);
  }
  return {
    url: `${GET_SETTINGS}`,
    method: "POST",
    data: formData,
    authorizationHeader: false,
  };
};

export const get_settings = async (type) => {
  return {
    data: {
      web_settings: [
        {
          light_logo: "/mock-logo.png",
          logo: "/mock-logo.png",
          app_download_section_appstore_url: "https://appstore.com/mock",
          app_download_section_playstore_url: "https://play.google.com/mock",
          copyright_details: "© 2024 Mock Company",
          landing_page_main_title: "Welcome to Mock Restaurant",
          landing_page_description: "Order your favorite food online!",
          story_section_tile: "Our Story",
          story_section_description: "We serve delicious food.",
          meta_description: "Mock meta description",
          meta_keywords: "mock, food, restaurant",
          favicon: "/favicon.ico",
        },
      ],
      system_settings: [
        { is_web_maintenance_mode_on: "0" }
      ]
    }
  };
};

export const manage_cart = async ({
  user_id,
  product_variant_id,
  clear_cart = 0,
  is_saved_for_later = 0,
  qty,
  add_on_id,
  add_on_qty,
}) => {
  const formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("product_variant_id", product_variant_id);
  formData.append("clear_cart", clear_cart);
  formData.append("clear_cart", is_saved_for_later);
  formData.append("qty", qty);
  formData.append("add_on_id", add_on_id);
  formData.append("add_on_qty", add_on_qty);

  try {
    const response = await axios.post(MANAGE_CART, formData);
    // Handle successful response here
    return response.data;
  } catch (error) {
    // Handle error here
    console.log(error);
  }
};

//  Add/Update
// user_id:2
// product_variant_id:23
// clear_cart:1|0 {1 => clear cart | 0 => default, optional}
// is_saved_for_later: 1 { default:0 }
// qty:2 // pass 0 to remove qty
// add_on_id:1           {optional}
// add_on_qty:1

export const phonePeApi = async () => {
  const response = await axios.post(SETPHONEPE);
  return response;
};

export const give_order_rating = async (
  order_id,
  rating,
  comment = null,
  images = []
) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("order_id", order_id);
  formData.append("rating", rating);

  if (comment !== null) {
    formData.append("comment", comment);
  }
  if (images.length > 0) {
    formData.append("images", images);
  }

  const response = await axios.post(SETORDERRATING, formData);
  return response.data;
};

export const give_product_rating = async (formData) => {
  let user_id = getUser();
  formData.append("user_id", user_id);

  const response = await axios.post(SETPRODUCTRATING, formData);
  return response.data;
};

export const give_rider_rating = async (
  rider_id,
  rating,
  comment = "",
  orderId
) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("rider_id", rider_id);
  formData.append("rating", rating);
  formData.append("order_id", orderId);

  formData.append("comment", comment);

  const response = await axios.post(SETRIDERRATING, formData);
  return response.data;
};

export const send_withdraw_request = async (amount, payment_address = null) => {
  let id = getUser();
  const formData = new FormData();
  formData.append("user_id", id);
  formData.append("amount", amount);

  if (payment_address !== null) {
    formData.append("payment_address", payment_address);
  }

  const response = await axios.post(SENWITHDRWALREQUEST, formData);
  return response.data;
};

export const get_live_tracking_details = async (order_id = null) => {
  const formData = new FormData();
  if (order_id != null) {
    formData.append("order_id", order_id);
    const response = await axios.post(GET_LIVE_TRACKING_DETAILS, formData);
    return response.data;
  } else {
    toast.error("Order_id is required");
  }
};

export const get_notifications = async ({ limit = 10, offset = 0 }) => {
  const formData = new FormData();
  formData.append("limit", limit);
  formData.append("offset", offset);
  const response = await axios.post(GET_NOTIFICATION, formData);
  return response.data;
};

export const create_midtrans_transaction = async (amount, order_id) => {
  const formData = new FormData();
  formData.append("amount", amount);
  formData.append("order_id", order_id);
  const response = await axios.post(CREATE_MIDTRANS_TRANSACTION, formData);
  return response.data;
};
export const get_midtrans_transaction_status = async (order_id) => {
  const formData = new FormData();
  formData.append("order_id", order_id);
  const response = await axios.post(GET_MIDTRANS_TRANSACTION_STATUS, formData);
  return response.data;
};

export const midtrans_wallet_transaction = async (wallet_order_id) => {
  const formData = new FormData();
  formData.append("order_id", wallet_order_id);
  const response = await axios.post(MIDTRANS_WALLET_TRANSACTION, formData);
  return response.data;
};

export const phonepe_web = async ({
  order_id = "",
  amount = "",
  type = "cart",
  redirect_url = "",
  mobile = "",
} = {}) => {
  const formData = new FormData();
  formData.append("order_id", order_id);
  formData.append("amount", amount);
  formData.append("type", type);
  formData.append("redirect_url", redirect_url);
  if (type !== "cart") formData.append("mobile", mobile);

  const response = await axios.post(PHONEPE_WEB, formData);
  return response.data;
};

export async function registerUser({ email, password, fullName, phone, cityId, langKey }) {
  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*"
      },
      body: JSON.stringify({ email, password, fullName, phone, cityId, langKey })
    });
    const result = await response.json();
    if (result.code === 201) {
      return { error: false, message: result.message };
    } else {
      return { error: true, message: result.message || "Registration failed" };
    }
  } catch (err) {
    return { error: true, message: "Network error" };
  }
}

// get_restaurants_all - New function for fetching all restaurants
export const get_restaurants_all = async () => {
  try {
    const response = await axios.get(GET_RESTAURANTS_ALL);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

// Thêm function mới để lấy menu items
export const get_menu_items = async () => {
  try {
    const response = await axios.get(GET_MENU_ITEMS_ALL);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};

// get_menu_items_by_restaurant - New function for fetching menu items by restaurant ID
export const get_menu_items_by_restaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`${GET_MENU_ITEMS_BY_RESTAURANT}?restaurantId=${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items by restaurant:", error);
    throw error;
  }
};
