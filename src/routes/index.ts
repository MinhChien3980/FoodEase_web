// Route constants for easy reference - defined first to avoid circular imports
export const ROUTE_PATHS = {
  // Root
  ROOT: '/',
  LANDING: '/',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_STORES: '/admin/stores',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_COURIERS: '/admin/couriers',
  
  // Customer
  CUSTOMER: '/foodease',
  CUSTOMER_HOME: '/foodease',
  CUSTOMER_RESTAURANTS: '/foodease/restaurants',
  CUSTOMER_OFFERS: '/foodease/offers',
  CUSTOMER_CART: '/foodease/cart',
  CUSTOMER_FAVORITES: '/foodease/favorites',
  CUSTOMER_PROFILE: '/foodease/profile',
  CUSTOMER_LOGIN: '/foodease/login',
  CUSTOMER_REGISTER: '/foodease/register',
  
  // Auth
  AUTH_LOGIN: '/login',
  AUTH_REGISTER: '/register',
  AUTH_FORGOT_PASSWORD: '/forgot-password',
  AUTH_UPDATE_PASSWORD: '/update-password',
} as const;

// Type for route paths
export type RoutePath = typeof ROUTE_PATHS[keyof typeof ROUTE_PATHS];

// Export route components after constants are defined
export { adminRoutes, adminResources } from './adminRoutes';
export { customerRoutes, customerNavItems, customerRouteGroups } from './customerRoutes';
export { authRoutes, authConfig, authRouteGroups } from './authRoutes';
export { rootRoutes, rootConfig } from './rootRoutes';

// Export route utilities and types
export * from './routeUtils'; 