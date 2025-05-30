// Food delivery specific utility functions adapted from FoodEase
import toast from "react-hot-toast";

interface CurrencySettings {
  decimalPoints: number;
  currencySymbol: string;
  currencyFormate: string;
  currencySymbolPosition: "start" | "end";
}

// Default currency settings - can be configured per application
const defaultCurrencySettings: CurrencySettings = {
  decimalPoints: 2,
  currencySymbol: "$",
  currencyFormate: ",",
  currencySymbolPosition: "start",
};

/**
 * Format price with proper currency symbol and formatting
 */
export const formatPrice = (
  price: number | string,
  currencySettings: CurrencySettings = defaultCurrencySettings
): string => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) return "0.00";

  // Format the number with the desired number of decimal places
  const formattedPrice = numericPrice.toFixed(currencySettings.decimalPoints);

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
      ? `${currencySettings.currencySymbol}${finalIntegerPart}.${decimalPart}`
      : `${finalIntegerPart}.${decimalPart}${currencySettings.currencySymbol}`;

  return formattedPriceStr;
};

/**
 * Extract structured address from Google Places API response
 */
export const extractAddress = (place: any) => {
  const address = {
    city: "",
    state: "",
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

  place.address_components.forEach((component: any) => {
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

/**
 * Format date for food delivery context
 */
export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${day}, ${month.toUpperCase()} ${year}`;
};

/**
 * Generate unique order ID
 */
export const createOrderId = (userId?: string | number): string => {
  const currentTime = new Date().getTime();
  const randomDigits = Math.floor(Math.random() * 900) + 100;
  
  if (userId) {
    return `order-${userId}-${currentTime}-${randomDigits}`;
  }
  
  return `order-${currentTime}-${randomDigits}`;
};

/**
 * Capitalize first letter of string
 */
export const capitalizeFirstLetter = (string: string): string => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Calculate delivery time estimate
 */
export const calculateDeliveryTime = (
  preparationTime: number,
  deliveryDistance: number
): string => {
  // Basic algorithm: prep time + (distance * 2 minutes per km)
  const estimatedMinutes = preparationTime + Math.ceil(deliveryDistance * 2);
  
  if (estimatedMinutes < 60) {
    return `${estimatedMinutes} mins`;
  }
  
  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = estimatedMinutes % 60;
  
  if (minutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} mins`;
};

/**
 * Validate restaurant operating hours
 */
export const isRestaurantOpen = (
  openTime: string,
  closeTime: string,
  currentTime: Date = new Date()
): boolean => {
  const current = currentTime.getHours() * 60 + currentTime.getMinutes();
  
  // Convert time strings to minutes
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  
  const open = openHour * 60 + openMin;
  const close = closeHour * 60 + closeMin;
  
  // Handle overnight restaurants (e.g., open 22:00, close 02:00)
  if (close < open) {
    return current >= open || current <= close;
  }
  
  return current >= open && current <= close;
};

/**
 * Show toast notifications with consistent styling
 */
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: () => toast.dismiss(),
};

/**
 * Calculate order totals
 */
export const calculateOrderTotal = (
  subtotal: number,
  deliveryFee: number = 0,
  taxes: number = 0,
  discounts: number = 0
) => {
  const total = subtotal + deliveryFee + taxes - discounts;
  return {
    subtotal,
    deliveryFee,
    taxes,
    discounts,
    total: Math.max(0, total), // Ensure total is never negative
  };
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Basic international phone number validation
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.trim());
};

/**
 * Generate restaurant slug from name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
}; 