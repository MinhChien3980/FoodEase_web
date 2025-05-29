// import {} from "@cond"

import { currencySettings } from "@/@core/config";
import { store } from "@/store/store";
import { getUserData, isLogged } from "@/events/getters";
import {
  add_to_favorites,
  delete_order,
  remove_from_favorites,
} from "@/interceptor/api";
import {
  setFavProduct,
  setFavRestro,
  setFavSectionProduct,
} from "@/store/reducers/Home/homeSlice";
import toast from "react-hot-toast";
import { setDeliveryAddress } from "@/store/reducers/deliveryTipSlice";
import { setPromoCode } from "@/store/reducers/promoCodeSlice";

export const formatePrice = (price) => {
  const currencySymbol =
    store.getState()?.settings?.value?.system_settings[0]?.currency;

  if (typeof price == "string") {
    price = parseFloat(price);
  }
  // Format the number with the desired number of decimal places
  const formattedPrice = price
    ? price?.toFixed(currencySettings.decimalPoints)
    : "0.0";

  // Split the formatted price into integer and decimal parts
  const [integerPart, decimalPart] = formattedPrice.split(".");

  // Remove any existing commas from the integer part
  const formattedIntegerPart = integerPart.replace(/,/g, "");

  // Add commas to the formatted integer part
  const finalIntegerPart = formattedIntegerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    currencySettings.currencyFormate
  );

  // Combine the formatted parts with the currency symbol based on position
  const formattedPriceStr =
    currencySettings.currencySymbolPosition === "start"
      ? `${
          currencySymbol ?? currencySettings.currencySymbol
        }${finalIntegerPart}.${decimalPart}`
      : `${finalIntegerPart}.${decimalPart}${
          currencySymbol ?? currencySettings.currencySymbol
        }`;

  return formattedPriceStr;
};
export const requestLocationPermission = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("Location access granted:", position);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.log("Location access denied. Requesting permission...");
        } else {
          console.error("Error occurred while accessing location:", error);
        }
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

export const isSSR = () => {
  return process.env.NEXT_PUBLIC_SSR == "true";
};

export const navigateErrorPage = (data) => {};

export const extractAddress = (place) => {
  const address = {
    city: "",
    state: "",
    // zip: "",
    country: "",
    plain() {
      const city = this.city ? this.city + ", " : "";
      const state = this.state ? this.state + ", " : "";
      return city + state + this.country;
    },
  };

  if (!Array.isArray(place?.address_components)) {
    return address;
  }

  place.address_components.forEach((component) => {
    const types = component.types;
    const value = component.long_name;

    if (types.includes("locality")) {
      address.city = value;
    }

    if (types.includes("administrative_area_level_2")) {
      address.state = value;
    }

    if (types.includes("country")) {
      address.country = value;
    }
  });

  return address;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${day}, ${month.toUpperCase()} ${year}`;
  return formattedDate;
};

export const createOrderId = (PhonePe = false) => {
  const UserData = getUserData();
  const userId = UserData?.id;

  const currentTime = new Date("2023-07-20T04:21:14"); // Example timestamp
  const timeInMilliseconds = currentTime.getTime();

  const randomDigits = Math.floor(Math.random() * 900) + 100;

  const orderId = `wallet-refill-user-${userId}-${timeInMilliseconds}-${randomDigits}`;
  if (PhonePe) {
    return `${userId}-${timeInMilliseconds}-${randomDigits}`;
  } else {
    return orderId;
  }
};

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

export const getFirebaseConfig = () => {
  return firebaseConfig;
};

export const getVapidKey = () => {
  return process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
};

export const getHeaderTitle = (title) => {
  const siteTitle =
    store.getState().settings.value?.web_settings?.[0]?.site_title || "";
  return title ? `${title}${siteTitle ? " | " : ""} ${siteTitle}` : siteTitle;
};

export const capitalizeFirstLetter = (string) => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else null;
};

// Function to get selected addons
export const getSelectedAddons = (addonsId, addons) => {
  // Step 1: Parse addonsId to get an array of IDs
  const addonsIdArray = addonsId.split(", ").map((id) => id.trim());

  // Step 2: Initialize an empty array for selectedAddons
  const selectedAddons = [];

  // Step 3: Loop through the addons array and find matches
  addons.forEach((addon) => {
    if (addonsIdArray.includes(addon.id)) {
      selectedAddons.push(addon);
    }
  });

  // Return the selectedAddons array
  return selectedAddons;
};

export const FavToggle = async ({
  isFavorite, // This is a string that can be "1" or "0"
  favType = "products",
  Product,
  restaurant,
  setIsFavorite,
  handleFavoriteToggleParent = false,
}) => {
  if (!isLogged()) {
    toast.error("Please login First !");
    return;
  }
  setIsFavorite(isFavorite == "1" ? "0" : "1");
  // Check the current value of isFavorite
  const response = await (isFavorite == "1"
    ? remove_from_favorites({
        type: favType,
        type_id: favType === "products" ? Product.id : restaurant.partner_id,
      })
    : add_to_favorites({
        type: favType,
        type_id: favType === "products" ? Product.id : restaurant.partner_id, // Fixed id assignment
      }));

  // If the API call fails, show an error message and return the initial isFavorite value
  if (response.error) {
    toast.error(response.message);
    setIsFavorite(isFavorite == "1" ? "0" : "1");
    return;
  } else {
    if (handleFavoriteToggleParent) {
      handleFavoriteToggleParent();
    }
    // If the API call succeeds, update the store and show a success message
    if (favType === "products") {
      store.dispatch(setFavProduct({ Product }));
      store.dispatch(setFavSectionProduct({ Product }));
    } else {
      store.dispatch(setFavRestro({ restaurant }));
    }
    toast.success(response.message);
  }

  // Toggle the value of isFavorite
  return;
};

export const selectDefaultAddress = () => {
  const Addresses = store.getState().userAddresses.value;
  if (!Addresses) {
    return;
  }
  const defaultAddress = Addresses.find(
    (address) => address.is_default === "1"
  );

  if (defaultAddress) {
    store.dispatch(setDeliveryAddress(defaultAddress));
  } else {
    // console.log("No default address found");
  }
};

export const getRelativeTime = (dateString) => {
  const now = new Date();
  const sentDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - sentDate) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return rtf.format(-diffInMinutes, "minute");
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return rtf.format(-diffInHours, "hour");
  } else if (diffInSeconds < 2592000) {
    const diffInDays = Math.floor(diffInSeconds / 86400);
    return rtf.format(-diffInDays, "day");
  } else if (diffInSeconds < 31536000) {
    const diffInMonths = Math.floor(diffInSeconds / 2592000);
    return rtf.format(-diffInMonths, "month");
  } else {
    const diffInYears = Math.floor(diffInSeconds / 31536000);
    return rtf.format(-diffInYears, "year");
  }
};

export const removePromoCode = () => {
  store.dispatch(setPromoCode([]));
};

export const isProductAvailable = (
  start_time = "00:00:00",
  end_time = "00:00:00"
) => {
  if (start_time === "00:00:00" && end_time === "00:00:00") {
    // Available all the time
    return true;
  }
  const currentTime = new Date();
  const currentHours = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentSeconds = currentTime.getSeconds();

  // Convert start_time and end_time to Date objects for comparison
  const [startHours, startMinutes, startSeconds] = start_time
    .split(":")
    .map(Number);
  const [endHours, endMinutes, endSeconds] = end_time.split(":").map(Number);

  const isAfterStartTime =
    currentHours > startHours ||
    (currentHours === startHours && currentMinutes > startMinutes) ||
    (currentHours === startHours &&
      currentMinutes === startMinutes &&
      currentSeconds >= startSeconds);

  const isBeforeEndTime =
    currentHours < endHours ||
    (currentHours === endHours && currentMinutes < endMinutes) ||
    (currentHours === endHours &&
      currentMinutes === endMinutes &&
      currentSeconds <= endSeconds);

  // Return true if current time is between start_time and end_time
  return isAfterStartTime && isBeforeEndTime;
};

export const disableDevTools = () => {
  // Disable right-click context menu
  const disableContextMenu = (e) => {
    e.preventDefault();
  };
  document.addEventListener("contextmenu", disableContextMenu);
  // Disable F12 key and other dev tools opening shortcuts
  const disableShortcuts = (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J"))
    ) {
      e.preventDefault();
    }
  };
  document.addEventListener("keydown", disableShortcuts);
  // Clean up the event listeners when the component is unmounted
  return () => {
    document.removeEventListener("contextmenu", disableContextMenu);
    document.removeEventListener("keydown", disableShortcuts);
  };
};
