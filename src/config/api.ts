// API Configuration
const getApiUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
};

const API_URL = getApiUrl();

export const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 10000, 
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  RESTAURANTS: {
    GET_ALL: '/restaurants/all',
    GET_BY_ID: (id: number) => `/restaurants/${id}`,
    CREATE: '/restaurants',
    UPDATE: (id: number) => `/restaurants/${id}`,
    DELETE: (id: number) => `/restaurants/${id}`,
  },
  MENU_ITEMS: {
    GET_BY_RESTAURANT: (restaurantId: number) => `/restaurants/${restaurantId}/menu-items`,
    GET_BY_RESTAURANT_ID: (restaurantId: number) => `/menu-items/by-restaurant?restaurantId=${restaurantId}`,
    GET_BY_ID: (id: number) => `/menu-items/${id}`,
    CREATE: '/menu-items',
    UPDATE: (id: number) => `/menu-items/${id}`,
    DELETE: (id: number) => `/menu-items/${id}`,
  },
  CATEGORIES: {
    GET_ALL: '/categories/all',
    GET_BY_ID: (id: number) => `/categories/${id}`,
  },
  CITIES: {
    GET_ALL: '/cities/all',
  },
  AUTH: {
    LOGIN: '/auth/token',
    REGISTER: '/auth/register',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: (id: number) => `/users/${id}`,
    GET_ALL: '/users',
    GET_BY_ID: (id: number) => `/users/${id}`,
    CREATE: '/users',
    DELETE: (id: number) => `/users/${id}`,
    UPDATE_STATUS: (id: number) => `/users/${id}/status`,
  },
  CART: {
    GET_BY_USER: (userId: number) => `/cart?userId=${userId}`,
    CREATE: (userId: number) => `/cart/${userId}`,
    GET_ITEMS: (cartId: number) => `/cart-items?cartId=${cartId}`,
    ADD_ITEM: '/cart-items',
    UPDATE_ITEM: (cartItemId: number) => `/cart-items/${cartItemId}`,
    DELETE_ITEM: (cartItemId: number) => `/cart-items/${cartItemId}`,
    CLEAR_CART: (cartId: number) => `/cart-items/by-cart/${cartId}`,
  },
  ORDERS: {
    CREATE: '/orders',
    GET_ALL: '/orders',
    GET_BY_ID: (id: number) => `/orders/${id}`,
    GET_BY_USER: (userId: number) => `/orders/${userId}`,
    UPDATE: (id: number) => `/orders/${id}`,
  },
  ORDER_ITEMS: {
    GET_BY_ORDER_ID: (orderId: number) => `/orders/${orderId}/items`,
  },
  ADDRESSES: {
    CREATE: '/addresses/create',
    GET_BY_USER: (userId: number) => `/addresses/${userId}`,
    DELETE: (addressId: number) => `/addresses/delete?id=${addressId}`,
  },
  DELIVERIES: {
    GET_ALL: '/deliveries',
    GET_BY_ID: (id: number) => `/deliveries/${id}`,
    UPDATE_STATUS: (id: number) => `/deliveries/${id}/status`,
    CREATE: '/deliveries',
  },
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
  },
  TRANSACTIONS: {
    GET_ALL: '/transactions',
    GET_BY_ID: (id: number) => `/transactions/${id}`,
    GET_BY_ORDER: (orderId: number) => `/transactions/order/${orderId}`,
    CREATE: '/transactions',
    UPDATE: (id: number) => `/transactions/${id}`,
  },
  FAVORITES: {
    TOGGLE: '/favorites/toggle',
    GET_ALL: '/favorites',
  },
}; 