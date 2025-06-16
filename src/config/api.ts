// API Configuration
const getApiBaseUrl = (): string => {
  return 'http://localhost:5173/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
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
  },
  ORDER_ITEMS: {
    GET_BY_ORDER_ID: (orderId: number) => `/order-items/${orderId}`,
  },
  ADDRESSES: {
    CREATE: '/addresses/create',
    GET_BY_USER: (userId: number) => `/addresses/${userId}`,
  },
  DELIVERIES: {
    GET_ALL: '/deliveries',
    GET_BY_ID: (id: number) => `/deliveries/${id}`,
    UPDATE_STATUS: (id: number) => `/deliveries/${id}/status`,
    CREATE: '/deliveries',
  },
}; 