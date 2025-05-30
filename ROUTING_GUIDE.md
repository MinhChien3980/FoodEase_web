# FoodEase Routing Guide

This document explains the routing structure of the FoodEase application, which combines both admin panel and customer ordering interfaces in a single application.

## 🏠 Main Routes

### Root Landing Page
- **URL**: `/` 
- **Component**: `LandingPage`
- **Description**: Welcome page that allows users to choose between Admin Panel and Customer App
- **Access**: Public (no authentication required)

---

## 👨‍💼 Admin Panel Routes

All admin routes are prefixed with `/admin` and require authentication.

### Main Admin Route
- **URL**: `/admin`
- **Component**: `DashboardPage` with `ThemedLayoutV2`
- **Description**: Main admin dashboard with analytics and overview
- **Access**: Requires authentication

### Admin Sub-routes

| Route | Description | Actions |
|-------|-------------|---------|
| `/admin/orders` | Order management | List, View details |
| `/admin/orders/:id` | Individual order details | View, Update status |
| `/admin/customers` | Customer management | List, View profiles |
| `/admin/customers/:id` | Customer profile details | View, Edit |
| `/admin/products` | Product catalog management | List, Create, Edit, Delete |
| `/admin/products/new` | Create new product | Create |
| `/admin/products/:id/edit` | Edit existing product | Edit |
| `/admin/stores` | Restaurant/Store management | List, Create, Edit |
| `/admin/stores/new` | Add new restaurant | Create |
| `/admin/stores/:id/edit` | Edit restaurant details | Edit |
| `/admin/categories` | Food category management | List, Manage |
| `/admin/couriers` | Delivery courier management | List, Create, Edit |
| `/admin/couriers/new` | Add new courier | Create |
| `/admin/couriers/:id/edit` | Edit courier details | Edit |

### Admin Features
- **Dashboard Analytics**: Order statistics, revenue charts, performance metrics
- **Order Management**: Real-time order tracking, status updates, customer communication
- **Restaurant Management**: Add/edit restaurants, menu management, availability settings
- **Product Management**: Food item catalog, pricing, categories, images
- **Customer Support**: Customer profiles, order history, issue resolution
- **Courier Management**: Delivery staff management, performance tracking
- **Reports & Analytics**: Business insights, sales reports, popular items

---

## 🍕 Customer App Routes

All customer routes are prefixed with `/foodease` and use a custom customer layout.

### Main Customer Route
- **URL**: `/foodease`
- **Component**: `HomePage` with `CustomerLayout`
- **Description**: Customer homepage with featured restaurants and search
- **Access**: Public (no authentication required)

### Customer Sub-routes

| Route | Description | Features |
|-------|-------------|----------|
| `/foodease` | Homepage | Hero section, featured restaurants, categories, search |
| `/foodease/restaurants` | Restaurant listing | Advanced filters, map view, sorting, pagination |
| `/foodease/offers` | Deals and promotions | Special offers, expiring deals, discount coupons |
| `/foodease/favorites` | User favorites | Saved restaurants and dishes (coming soon) |

### Customer Features
- **Restaurant Discovery**: Browse local restaurants with ratings, reviews, and cuisine filters
- **Advanced Search**: Search by restaurant name, cuisine type, or location
- **Interactive Maps**: View restaurant locations with delivery radius visualization
- **Smart Filtering**: Filter by delivery fee, preparation time, ratings, open status
- **Special Offers**: Browse and apply promotional deals and discounts
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

---

## 🔐 Authentication Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Admin login page | Public |
| `/register` | Admin registration | Public |
| `/forgot-password` | Password recovery | Public |
| `/update-password` | Password update | Public |

---

## 🔄 Navigation Between Sections

### From Customer App to Admin Panel
- **Header Button**: "Admin Panel" button in customer layout header
- **User Menu**: Admin Panel option in user dropdown menu
- **Landing Page**: Navigate to `/` and choose Admin Panel

### From Admin Panel to Customer App
- **Direct Navigation**: Visit `/foodease` directly
- **Landing Page**: Navigate to `/` and choose Customer App

### Landing Page Access
- **Root URL**: Direct access via `/`
- **Legacy Support**: `/welcome` redirects to `/`

---

## 🛠 Technical Implementation

### Route Structure
```
/                           # Landing Page (choose admin or customer)
├── /admin                  # Admin Panel (requires auth)
│   ├── /orders            # Order management
│   ├── /customers         # Customer management  
│   ├── /products          # Product catalog
│   ├── /stores            # Restaurant management
│   ├── /categories        # Category management
│   └── /couriers          # Courier management
├── /foodease              # Customer App (public)
│   ├── /restaurants       # Restaurant listing
│   ├── /offers           # Deals and promotions
│   └── /favorites        # User favorites
└── /login                 # Authentication
```

### Layout Components
- **Admin Routes**: Use `ThemedLayoutV2` from Refine with admin sidebar and header
- **Customer Routes**: Use custom `CustomerLayout` with customer navigation and footer
- **Landing Page**: Standalone layout with choice between admin and customer

### Authentication Flow
1. **Admin Panel**: Requires login, redirects to `/login` if not authenticated
2. **Customer App**: Public access, no authentication required
3. **Landing Page**: Public access, provides entry points to both sections

---

## 🚀 Getting Started

1. **Start the application**: `npm run dev`
2. **Access landing page**: Visit `http://localhost:5173/`
3. **Choose your path**:
   - **Customer Experience**: Click "Start Ordering Food" → `/foodease`
   - **Admin Management**: Click "Access Admin Panel" → `/admin` (requires login)

### Demo Credentials (Admin Panel)
- **Email**: `demo@refine.dev`
- **Password**: `demodemo`

---

## 📱 Mobile Compatibility

Both admin and customer interfaces are fully responsive:
- **Customer App**: Optimized mobile-first design with touch-friendly navigation
- **Admin Panel**: Responsive dashboard with collapsible sidebar for mobile devices

This routing structure provides a complete food delivery platform with separate optimized experiences for customers and administrators while maintaining a unified codebase. 