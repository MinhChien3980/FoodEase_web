// API Configuration
const getApiBaseUrl = (): string => {
  // Tự động detect environment và chọn URL phù hợp
    return 'http://localhost:8080/api'; 
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
    GET_BY_ID: (id: number) => `/menu-items/${id}`,
    CREATE: '/menu-items',
    UPDATE: (id: number) => `/menu-items/${id}`,
    DELETE: (id: number) => `/menu-items/${id}`,
  },
  CATEGORIES: {
    GET_ALL: '/categories',
    GET_BY_ID: (id: number) => `/categories/${id}`,
  },
}; 