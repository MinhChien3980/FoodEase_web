# eRestro Multi-Restaurant Web App - Routing System Documentation

## Overview

This document provides a comprehensive guide to the routing system implemented in the eRestro multi-restaurant web application. The system is built on Next.js with centralized route management, authentication protection, and consistent navigation patterns.

## File Structure

```
src/
├── lib/
│   ├── routes.js              # Centralized route definitions
│   └── routeMiddleware.js     # Route protection and middleware
├── pages/                     # Next.js pages
│   ├── index.js              # Landing page
│   ├── home/                 # Home page after city selection
│   ├── products/             # Product pages
│   ├── restaurants/          # Restaurant pages
│   ├── categories/           # Category pages
│   ├── cart/                 # Shopping cart
│   ├── user/                 # User dashboard pages
│   ├── offers/               # Offers page
│   ├── notifications/        # Notifications
│   ├── contact-us/           # Contact page
│   ├── privacy-policy/       # Privacy policy
│   └── terms-conditions/     # Terms and conditions
└── component/
    ├── Navbar/               # Navigation components
    ├── Profile/              # Profile navigation
    └── Navigation/           # Mobile navigation
```

## Route Definitions

### Main Application Routes

| Route | Path | Description | Auth Required |
|-------|------|-------------|---------------|
| Index | `/` | Landing page with city selection | No |
| Home | `/home` | Main homepage after city selection | No |
| Products | `/products` | Product listing page | No |
| Product Detail | `/products/[slug]` | Individual product page | No |
| Restaurants | `/restaurants` | Restaurant listing page | No |
| Restaurant Detail | `/restaurants/[slug]` | Individual restaurant page | No |
| Categories | `/categories` | Category listing page | No |
| Category Detail | `/categories/[slug]` | Products in specific category | No |
| Cart | `/cart` | Shopping cart | Yes |
| Offers | `/offers` | Special offers and deals | No |
| Notifications | `/notifications` | User notifications | Yes |

### User Dashboard Routes

| Route | Path | Description | Auth Required |
|-------|------|-------------|---------------|
| User Dashboard | `/user` | User profile dashboard | Yes |
| Profile | `/user/profile` | Edit user profile | Yes |
| My Orders | `/user/orders` | Order history | Yes |
| Order Detail | `/user/orders/[id]` | Specific order details | Yes |
| Addresses | `/user/addresses` | Manage delivery addresses | Yes |
| Add Address | `/user/addresses/add` | Add new address | Yes |
| Edit Address | `/user/addresses/edit/[id]` | Edit existing address | Yes |
| Favorites | `/user/favorites` | Favorite restaurants/products | Yes |
| Wallet | `/user/wallet` | Wallet balance and management | Yes |
| Transactions | `/user/transactions` | Transaction history | Yes |

### Information Pages

| Route | Path | Description | Auth Required |
|-------|------|-------------|---------------|
| Contact Us | `/contact-us` | Contact information and form | No |
| Privacy Policy | `/privacy-policy` | Privacy policy | No |
| Terms & Conditions | `/terms-conditions` | Terms and conditions | No |
| Exclusive Products | `/exclusiveProducts` | Special product section | No |

### API Routes

| Route | Path | Description |
|-------|------|-------------|
| Authentication | `/api/auth` | User authentication endpoints |
| Orders | `/api/orders` | Order management endpoints |
| Products | `/api/products` | Product data endpoints |
| Restaurants | `/api/restaurants` | Restaurant data endpoints |
| Categories | `/api/categories` | Category data endpoints |
| Users | `/api/users` | User management endpoints |
| Payments | `/api/payments` | Payment processing endpoints |
| Notifications | `/api/notifications` | Notification endpoints |

## Usage Examples

### Basic Navigation

```javascript
import { routes } from '@/lib/routes';
import Link from 'next/link';

// Static route
<Link href={routes.products}>View Products</Link>

// Dynamic route
<Link href={routes.productDetail('pizza-margherita')}>
  Pizza Margherita
</Link>
```

### Protected Route Navigation

```javascript
import { useRouteProtection } from '@/lib/routeMiddleware';
import { useRouter } from 'next/router';

const MyComponent = () => {
  const router = useRouter();
  const { navigate, canAccessRoute } = useRouteProtection(router);

  const handleViewOrders = () => {
    navigate(routes.user.orders); // Automatically handles auth check
  };

  return (
    <button 
      onClick={handleViewOrders}
      disabled={!canAccessRoute(routes.user.orders)}
    >
      View Orders
    </button>
  );
};
```

### Navigation Menu Setup

```javascript
import { navigationMenus } from '@/lib/routes';

const NavbarMenu = () => {
  return (
    <nav>
      {navigationMenus.main.map((item) => (
        <Link key={item.label} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
```

## Navigation Components

### Main Navbar (`src/component/Navbar/Navbar.jsx`)
- Desktop navigation for main application sections
- Integrated location selection
- Search functionality
- Cart and notification access
- User profile dropdown

### Mobile Header (`src/component/Navbar/MobileHeader.jsx`)
- Mobile-optimized navigation drawer
- Hamburger menu with full navigation
- User authentication status handling
- Responsive design patterns

### Mobile Bottom Navigation (`src/component/Navigation/MobileBottomNavigation.jsx`)
- Fixed bottom navigation for mobile devices
- Quick access to home, favorites, search, and profile
- Tab-based navigation with active state indicators

### Profile Navigation Components
- **ProfileNavigation.jsx**: Quick access cards for user actions
- **ProfileTabs.jsx**: Detailed list of user account sections
- **ProfileButton.js**: Dropdown menu for authenticated users

## Route Protection

### Authentication Requirements

Routes are automatically protected based on configuration in `routeMiddleware.js`:

```javascript
// Protected routes (require login)
const protectedRoutes = [
  routes.user.profile,
  routes.user.orders,
  routes.user.addresses,
  routes.user.favorites,
  routes.user.wallet,
  routes.user.transactions,
  routes.cart,
];
```

### Route Guard Implementation

```javascript
import { routeGuard } from '@/lib/routeMiddleware';

// Check if user can access a route
const canAccess = routeGuard.canAccess('/user/orders');

if (!canAccess.canAccess) {
  // Handle redirect or show error
  toast.error(canAccess.message);
  router.push(canAccess.redirectTo);
}
```

## SEO and Metadata

Each route has associated metadata for SEO optimization:

```javascript
const routeMetadata = {
  [routes.home]: {
    title: 'Home - eRestro',
    description: 'Order delicious food from your favorite restaurants',
    requiresAuth: false,
    requiresLocation: true,
  },
  // ... more routes
};
```

## Active Route Detection

```javascript
import { isActiveRoute } from '@/lib/routes';
import { useRouter } from 'next/router';

const router = useRouter();

// Check if current route matches
const isActive = isActiveRoute(router.pathname, routes.products);

// Apply active styles
<Link 
  href={routes.products}
  className={isActive ? 'active' : ''}
>
  Products
</Link>
```

## Best Practices

### 1. Always Use Centralized Routes
```javascript
// ❌ Don't use hardcoded paths
<Link href="/user/orders">My Orders</Link>

// ✅ Use centralized routes
<Link href={routes.user.orders}>My Orders</Link>
```

### 2. Handle Dynamic Routes Properly
```javascript
// ✅ For dynamic routes with parameters
const productSlug = 'pizza-margherita';
<Link href={routes.productDetail(productSlug)}>
  View Product
</Link>
```

### 3. Use Route Protection
```javascript
// ✅ Use middleware for protected navigation
import { navigateWithProtection } from '@/lib/routeMiddleware';

const handleNavigation = () => {
  navigateWithProtection(routes.user.orders, router);
};
```

### 4. Consistent Navigation Patterns
```javascript
// ✅ Use navigation menus from configuration
import { navigationMenus } from '@/lib/routes';

navigationMenus.main.map((item) => (
  <NavigationItem key={item.label} {...item} />
))
```

## Mobile-First Design

The routing system is designed with mobile-first principles:

- **Bottom Navigation**: Primary navigation for mobile users
- **Drawer Navigation**: Secondary navigation accessible via hamburger menu
- **Responsive Design**: Adaptive navigation based on screen size
- **Touch-Friendly**: Optimized touch targets for mobile interaction

## Error Handling

### 404 Page
- Custom 404 page at `src/pages/404.jsx`
- Redirects to appropriate pages based on user state

### Route Protection Errors
- Automatic toast notifications for access denied
- Graceful redirects to appropriate pages
- Maintains user experience with helpful error messages

## Future Enhancements

### Planned Features
1. **Route Caching**: Implement route-based caching strategies
2. **Analytics Integration**: Track route navigation for analytics
3. **A/B Testing**: Route-based feature testing
4. **Progressive Loading**: Implement route-based progressive loading
5. **Deep Linking**: Enhanced deep linking for mobile apps

### Extensibility
The routing system is designed to be easily extensible:
- Add new routes in `routes.js`
- Configure protection in `routeMiddleware.js`
- Update navigation menus in configuration
- Maintain consistent patterns across components

## Troubleshooting

### Common Issues

1. **Route Not Found**: Ensure route is defined in `routes.js`
2. **Authentication Errors**: Check if route requires authentication
3. **Dynamic Route Issues**: Verify parameter naming and structure
4. **Mobile Navigation**: Test across different screen sizes

### Debugging Tips
- Use browser dev tools to inspect route changes
- Check console for navigation errors
- Verify authentication state in Redux dev tools
- Test route protection with different user states

This routing system provides a solid foundation for the eRestro multi-restaurant web application, ensuring consistent navigation, proper authentication handling, and excellent user experience across all devices. 