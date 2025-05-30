import { routes } from './routes';
import { isLogged } from '@/events/getters';
import toast from 'react-hot-toast';

// Define which routes require authentication
export const protectedRoutes = [
  routes.user.profile,
  routes.user.orders,
  routes.user.addresses,
  routes.user.favorites,
  routes.user.wallet,
  routes.user.transactions,
  routes.cart, // Cart might require login in some cases
];

// Define admin/restricted routes (if any)
export const adminRoutes = [
  // Add admin routes here if needed
];

// Define public routes that logged-in users shouldn't access
export const guestOnlyRoutes = [
  // Add routes like login, register if you have them
];

// Route metadata for different route types
export const routeMetadata = {
  [routes.home]: {
    title: 'Home - eRestro',
    description: 'Order delicious food from your favorite restaurants',
    requiresAuth: false,
    requiresLocation: true, // Most food delivery apps require location
  },
  [routes.products]: {
    title: 'Products - eRestro',
    description: 'Browse our delicious food products',
    requiresAuth: false,
    requiresLocation: true,
  },
  [routes.restaurants]: {
    title: 'Restaurants - eRestro',
    description: 'Discover amazing restaurants near you',
    requiresAuth: false,
    requiresLocation: true,
  },
  [routes.categories]: {
    title: 'Categories - eRestro',
    description: 'Browse food by categories',
    requiresAuth: false,
    requiresLocation: false,
  },
  [routes.cart]: {
    title: 'Cart - eRestro',
    description: 'Review your order',
    requiresAuth: true,
    requiresLocation: true,
  },
  [routes.user.profile]: {
    title: 'My Profile - eRestro',
    description: 'Manage your profile',
    requiresAuth: true,
    requiresLocation: false,
  },
  [routes.user.orders]: {
    title: 'My Orders - eRestro',
    description: 'View your order history',
    requiresAuth: true,
    requiresLocation: false,
  },
  [routes.user.addresses]: {
    title: 'My Addresses - eRestro',
    description: 'Manage your delivery addresses',
    requiresAuth: true,
    requiresLocation: false,
  },
  [routes.user.favorites]: {
    title: 'My Favorites - eRestro',
    description: 'Your favorite restaurants and dishes',
    requiresAuth: true,
    requiresLocation: false,
  },
  [routes.user.wallet]: {
    title: 'My Wallet - eRestro',
    description: 'Manage your wallet balance',
    requiresAuth: true,
    requiresLocation: false,
  },
  [routes.user.transactions]: {
    title: 'Transactions - eRestro',
    description: 'View your transaction history',
    requiresAuth: true,
    requiresLocation: false,
  },
  [routes.offers]: {
    title: 'Offers - eRestro',
    description: 'Amazing deals and discounts',
    requiresAuth: false,
    requiresLocation: true,
  },
  [routes.notifications]: {
    title: 'Notifications - eRestro',
    description: 'Your notifications',
    requiresAuth: true,
    requiresLocation: false,
  },
};

// Route guard function
export const routeGuard = {
  canAccess: (path) => {
    const userLoggedIn = isLogged();
    
    // Check if route requires authentication
    if (protectedRoutes.includes(path) && !userLoggedIn) {
      return {
        canAccess: false,
        redirectTo: routes.index,
        message: 'Please login to access this page'
      };
    }
    
    // Check if route is guest-only and user is logged in
    if (guestOnlyRoutes.includes(path) && userLoggedIn) {
      return {
        canAccess: false,
        redirectTo: routes.home,
        message: 'You are already logged in'
      };
    }
    
    return {
      canAccess: true,
      redirectTo: null,
      message: null
    };
  },
  
  // Check if user has permission for admin routes
  hasAdminAccess: () => {
    // Implement admin check logic here
    return false; // Default to false for security
  },
  
  // Handle route protection with toast notifications
  handleProtectedRoute: (path, router) => {
    const guardResult = routeGuard.canAccess(path);
    
    if (!guardResult.canAccess) {
      if (guardResult.message) {
        toast.error(guardResult.message);
      }
      if (guardResult.redirectTo) {
        router.push(guardResult.redirectTo);
      }
      return false;
    }
    
    return true;
  }
};

// Helper function to get route metadata
export const getRouteMetadata = (path) => {
  // Try exact match first
  if (routeMetadata[path]) {
    return routeMetadata[path];
  }
  
  // Try pattern matching for dynamic routes
  for (const route in routeMetadata) {
    if (route.includes('[') && path.startsWith(route.split('[')[0])) {
      return routeMetadata[route];
    }
  }
  
  // Default metadata
  return {
    title: 'eRestro - Food Delivery',
    description: 'Order food online from your favorite restaurants',
    requiresAuth: false,
    requiresLocation: false,
  };
};

// Navigation helper with protection
export const navigateWithProtection = (path, router) => {
  if (routeGuard.handleProtectedRoute(path, router)) {
    router.push(path);
  }
};

// Custom hook for route protection (if using in components)
export const useRouteProtection = (router) => {
  const navigate = (path) => {
    navigateWithProtection(path, router);
  };
  
  const canAccessRoute = (path) => {
    return routeGuard.canAccess(path).canAccess;
  };
  
  return {
    navigate,
    canAccessRoute,
    routeGuard
  };
};

export default routeGuard; 