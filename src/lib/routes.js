export const routes = {
  // Main pages
  home: '/home',
  index: '/',
  
  // Product pages
  products: '/products',
  productDetail: (slug) => `/products/${slug}`,
  
  // Restaurant pages
  restaurants: '/restaurants',
  restaurantDetail: (slug) => `/restaurants/${slug}`,
  
  // Category pages
  categories: '/categories',
  categoryDetail: (slug) => `/categories/${slug}`,
  
  // User authentication pages
  cart: '/cart',
  
  // User dashboard pages
  user: {
    profile: '/user/profile',
    orders: '/user/orders',
    orderDetail: (id) => `/user/orders/${id}`,
    addresses: '/user/addresses',
    addAddress: '/user/addresses/add',
    editAddress: (id) => `/user/addresses/edit/${id}`,
    favorites: '/user/favorites',
    wallet: '/user/wallet',
    transactions: '/user/transactions',
    dashboard: '/user'
  },
  
  // Information pages
  offers: '/offers',
  notifications: '/notifications',
  contactUs: '/contact-us',
  privacyPolicy: '/privacy-policy',
  termsConditions: '/terms-conditions',
  
  // Special pages
  exclusiveProducts: '/exclusiveProducts',
  notFound: '/404',
  
  // API routes
  api: {
    auth: '/api/auth',
    orders: '/api/orders',
    products: '/api/products',
    restaurants: '/api/restaurants',
    categories: '/api/categories',
    users: '/api/users',
    payments: '/api/payments',
    notifications: '/api/notifications'
  }
};

// Navigation menu items configuration
export const navigationMenus = {
  main: [
    { 
      label: 'Categories', 
      href: routes.categories, 
      icon: 'RiLayoutGrid2Fill' 
    },
    { 
      label: 'Products', 
      href: routes.products, 
      icon: 'RiStackLine' 
    },
    { 
      label: 'offers', 
      href: routes.offers, 
      icon: 'RiDiscountPercentLine' 
    },
    { 
      label: 'restaurants', 
      href: routes.restaurants, 
      icon: 'RiRestaurantLine' 
    }
  ],
  
  user: [
    { 
      label: 'my-profile', 
      href: routes.user.profile, 
      icon: 'RiUserLine' 
    },
    { 
      label: 'my-orders', 
      href: routes.user.orders, 
      icon: 'RiFileList3Line' 
    },
    { 
      label: 'favourites', 
      href: routes.user.favorites, 
      icon: 'RiHeartLine' 
    },
    { 
      label: 'Addresses', 
      href: routes.user.addresses, 
      icon: 'RiMapPinLine' 
    },
    { 
      label: 'notifications', 
      href: routes.notifications, 
      icon: 'RiNotification3Line' 
    },
    { 
      label: 'Wallet', 
      href: routes.user.wallet, 
      icon: 'RiWalletFill' 
    },
    { 
      label: 'Transactions', 
      href: routes.user.transactions, 
      icon: 'RiBankFill' 
    },
    { 
      label: 'cart', 
      href: routes.cart, 
      icon: 'RiShoppingCartLine' 
    }
  ],
  
  footer: [
    { 
      label: 'terms-conditions', 
      href: routes.termsConditions 
    },
    { 
      label: 'privacy-policy', 
      href: routes.privacyPolicy 
    },
    { 
      label: 'contact-us', 
      href: routes.contactUs 
    }
  ]
};

// Breadcrumb configuration
export const breadcrumbConfig = {
  [routes.home]: { label: 'Home', showInBreadcrumb: false },
  [routes.products]: { label: 'Products', parent: routes.home },
  [routes.restaurants]: { label: 'Restaurants', parent: routes.home },
  [routes.categories]: { label: 'Categories', parent: routes.home },
  [routes.cart]: { label: 'Cart', parent: routes.home },
  [routes.offers]: { label: 'Offers', parent: routes.home },
  [routes.notifications]: { label: 'Notifications', parent: routes.home },
  [routes.user.profile]: { label: 'Profile', parent: routes.home },
  [routes.user.orders]: { label: 'My Orders', parent: routes.user.profile },
  [routes.user.addresses]: { label: 'Addresses', parent: routes.user.profile },
  [routes.user.favorites]: { label: 'Favorites', parent: routes.user.profile },
  [routes.user.wallet]: { label: 'Wallet', parent: routes.user.profile },
  [routes.user.transactions]: { label: 'Transactions', parent: routes.user.profile },
  [routes.contactUs]: { label: 'Contact Us', parent: routes.home },
  [routes.privacyPolicy]: { label: 'Privacy Policy', parent: routes.home },
  [routes.termsConditions]: { label: 'Terms & Conditions', parent: routes.home }
};

// Helper function to get route with parameters
export const getRoute = (routeKey, params = {}) => {
  const route = routes[routeKey];
  if (typeof route === 'function') {
    return route(params);
  }
  return route;
};

// Helper function to check if current route matches
export const isActiveRoute = (currentPath, targetPath) => {
  if (targetPath === routes.home) {
    return currentPath === targetPath;
  }
  return currentPath.startsWith(targetPath);
};

export default routes; 