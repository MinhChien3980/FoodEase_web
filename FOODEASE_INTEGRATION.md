# FoodEase Integration with Refine

This document outlines the integration of FoodEase components and features into the Refine.dev admin panel project.

## Overview

The following components and utilities have been extracted and adapted from the FoodEase web application to enhance the Refine admin panel with food delivery-specific functionality:

## 🏗️ Integrated Components

### 1. Utility Functions (`src/utils/foodHelpers.ts`)
- **formatPrice()**: Currency formatting with customizable settings
- **extractAddress()**: Google Places API address parsing
- **formatOrderDate()**: Date formatting for orders
- **createOrderId()**: Unique order ID generation
- **calculateDeliveryTime()**: Delivery time estimation
- **isRestaurantOpen()**: Restaurant hours validation
- **showToast**: Toast notification helpers
- **calculateOrderTotal()**: Order total calculations
- **isValidPhoneNumber()**: Phone number validation
- **generateSlug()**: URL slug generation

### 2. Rating Component (`src/components/common/RatingBox.tsx`)
- Displays star ratings with customizable sizes
- Supports both interactive and read-only modes
- Shows review counts
- Two variants: React Simple Star Rating and Material-UI Rating

### 3. Restaurant Card (`src/components/restaurant/RestaurantCard.tsx`)
- Displays restaurant information in card format
- Shows status indicators (Active/Inactive, Verified)
- Interactive map integration
- Rating display with review counts
- Cuisine type chips
- Admin action buttons (View, Edit, Delete)
- Status toggle functionality

### 4. Order Status Component (`src/components/order/OrderStatusChip.tsx`)
- Color-coded status chips for orders
- Icons for different order stages
- Helper functions for status progression
- Status validation utilities

### 5. Payment Gateway (`src/components/payment/PaymentGateway.tsx`)
- Stripe integration for card payments
- PayPal integration
- Unified payment interface
- Error handling and loading states
- Customizable payment methods

### 6. Google Maps Integration (`src/components/maps/GoogleMapComponent.tsx`)
- Restaurant location markers
- Delivery radius visualization
- Current location detection
- Interactive info windows
- Custom marker icons for active/inactive restaurants

### 7. Analytics Dashboard (`src/components/dashboard/OrderAnalytics.tsx`)
- Order and revenue charts
- Restaurant performance metrics
- Order status distribution
- Key performance indicators
- Responsive chart components using Recharts

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install @react-google-maps/api @stripe/react-stripe-js @stripe/stripe-js @paypal/react-paypal-js framer-motion react-hot-toast react-rating-stars-component react-simple-star-rating react-lazy-load-image-component swiper lottie-react @remixicon/react
```

### 2. Environment Configuration

Copy `env.example` to `.env` and configure the following variables:

```env
# Payment Gateway Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Google Maps API
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Application Settings
REACT_APP_CURRENCY_SYMBOL=$
REACT_APP_CURRENCY_POSITION=start
REACT_APP_DECIMAL_POINTS=2
```

### 3. API Keys Setup

#### Stripe
1. Create a Stripe account at https://stripe.com
2. Get your publishable key from the dashboard
3. Add it to your environment variables

#### PayPal
1. Create a PayPal developer account
2. Create an app in the PayPal Developer Console
3. Get your client ID

#### Google Maps
1. Create a Google Cloud Platform project
2. Enable the Maps JavaScript API
3. Create an API key and restrict it to your domain

## 📖 Usage Examples

### Restaurant Card
```tsx
import RestaurantCard from '../components/restaurant/RestaurantCard';

const restaurant = {
  id: '1',
  name: 'Pizza Palace',
  slug: 'pizza-palace',
  image: '/images/restaurant.jpg',
  rating: 4.5,
  reviewCount: 128,
  cuisineType: ['Italian', 'Pizza'],
  address: '123 Main St, City',
  preparationTime: 30,
  deliveryFee: 2.99,
  minimumOrder: 15.00,
  openTime: '09:00',
  closeTime: '22:00',
  isActive: true,
  isVerified: true,
  totalOrders: 1250,
  latitude: 40.7128,
  longitude: -74.0060
};

<RestaurantCard
  restaurant={restaurant}
  onEdit={(id) => console.log('Edit:', id)}
  onDelete={(id) => console.log('Delete:', id)}
  onView={(id) => console.log('View:', id)}
  onToggleStatus={(id, status) => console.log('Toggle:', id, status)}
/>
```

### Payment Gateway
```tsx
import PaymentGateway from '../components/payment/PaymentGateway';

<PaymentGateway
  amount={25.99}
  currency="USD"
  orderId="order-123"
  customerEmail="customer@example.com"
  onSuccess={(result) => console.log('Payment success:', result)}
  onError={(error) => console.log('Payment error:', error)}
  enableStripe={true}
  enablePayPal={true}
/>
```

### Google Maps
```tsx
import GoogleMapComponent from '../components/maps/GoogleMapComponent';

const restaurants = [
  {
    id: '1',
    name: 'Restaurant 1',
    latitude: 40.7128,
    longitude: -74.0060,
    address: '123 Main St',
    rating: 4.5,
    isActive: true,
    deliveryRadius: 5,
    image: '/restaurant1.jpg'
  }
];

<GoogleMapComponent
  restaurants={restaurants}
  center={{ lat: 40.7128, lng: -74.0060 }}
  zoom={12}
  height="500px"
  showDeliveryRadius={true}
  onRestaurantClick={(restaurant) => console.log('Clicked:', restaurant)}
/>
```

### Order Analytics
```tsx
import OrderAnalytics from '../components/dashboard/OrderAnalytics';

const analyticsData = {
  totalOrders: 1250,
  totalRevenue: 45670.50,
  activeRestaurants: 34,
  totalCustomers: 892,
  orderGrowth: 12.5,
  revenueGrowth: 18.3,
  orderTrend: [
    { date: '2024-01-01', orders: 45, revenue: 1250.50, avgOrderValue: 27.79 }
    // ... more data
  ],
  restaurantPerformance: [
    { name: 'Pizza Palace', orders: 125, revenue: 3450.00, rating: 4.5 }
    // ... more data
  ],
  orderStatusDistribution: [
    { status: 'Pending', count: 23, color: '#ff9800' },
    { status: 'Delivered', count: 156, color: '#4caf50' }
    // ... more data
  ]
};

<OrderAnalytics data={analyticsData} period="30d" />
```

## 🎨 Customization

### Theme Integration
All components use Material-UI theming and will automatically adapt to your Refine theme configuration.

### Currency Settings
Modify the currency settings in `src/utils/foodHelpers.ts`:

```tsx
const currencySettings = {
  decimalPoints: 2,
  currencySymbol: "€",
  currencyFormate: ".",
  currencySymbolPosition: "end",
};
```

### Status Colors
Customize order status colors in the OrderStatusChip component by modifying the `getStatusConfig` function.

## 🔐 Security Considerations

1. **API Keys**: Never expose secret API keys in frontend code
2. **Payment Processing**: Implement proper backend validation for all payments
3. **Data Validation**: Validate all user inputs on both frontend and backend
4. **Authentication**: Ensure proper authentication for admin functions

## 🚀 Performance Optimization

1. **Lazy Loading**: Components use React.lazy() for code splitting
2. **Image Optimization**: Use react-lazy-load-image-component for images
3. **Map Loading**: Google Maps loads only when needed
4. **Chart Performance**: Recharts components are optimized for large datasets

## 📱 Responsive Design

All components are built with mobile-first responsive design:
- Restaurant cards adapt to different screen sizes
- Charts are fully responsive
- Maps adjust to container dimensions
- Payment forms work on mobile devices

## 🐛 Troubleshooting

### Common Issues

1. **Google Maps not loading**: Check API key and enabled services
2. **Payment gateway errors**: Verify API keys and sandbox settings
3. **Chart rendering issues**: Ensure Recharts dependencies are installed
4. **TypeScript errors**: Install @types packages for third-party libraries

### Support

For issues related to the integrated components, check:
1. Component prop types and interfaces
2. Environment variable configuration
3. Required dependencies installation
4. API key setup and permissions

## 🔄 Migration from FoodEase

If migrating from the original FoodEase project:

1. Update import paths to match Refine structure
2. Adapt Redux state management to Refine patterns
3. Replace Next.js specific features with React alternatives
4. Update API calls to match your backend structure
5. Adapt routing to use React Router

## 📝 License

These integrated components maintain the same licensing terms as the original FoodEase project and are compatible with Refine.dev's open-source license. 