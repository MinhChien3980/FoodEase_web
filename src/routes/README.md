# Routes Organization

Cấu trúc routing đã được tái tổ chức để dễ bảo trì và tái sử dụng hơn.

## 📁 Cấu trúc thư mục

```
src/routes/
├── index.ts              # Export chính và constants
├── adminRoutes.tsx       # Routes cho Admin Panel
├── customerRoutes.tsx    # Routes cho Customer App
├── authRoutes.tsx        # Routes cho Authentication
├── rootRoutes.tsx        # Routes gốc và miscellaneous
├── routeUtils.tsx        # Utilities và helper functions
└── README.md            # Documentation này
```

## 🎯 Lợi ích của cấu trúc mới

### 1. **Tách biệt rõ ràng (Separation of Concerns)**
- Mỗi loại route được tách thành file riêng
- Dễ tìm và chỉnh sửa route cụ thể
- Giảm độ phức tạp của `App.tsx`

### 2. **Tái sử dụng tốt hơn (Better Reusability)**
- Route constants được định nghĩa tập trung
- Helper functions để validate và build routes
- Configuration có thể được import ở nhiều nơi

### 3. **Type Safety**
- TypeScript interfaces cho route configuration
- Typed route paths và resources
- IntelliSense support tốt hơn

### 4. **Maintainability**
- Dễ thêm route mới
- Dễ thay đổi cấu trúc route
- Code organization tốt hơn

## 📖 Cách sử dụng

### Import routes trong App.tsx:
```tsx
import { 
  adminRoutes, 
  customerRoutes, 
  authRoutes, 
  rootRoutes,
  enhanceResourcesWithIcons 
} from "./routes";
```

### Sử dụng route constants:
```tsx
import { ROUTE_PATHS } from "./routes";

// Redirect to admin dashboard
navigate(ROUTE_PATHS.ADMIN_DASHBOARD);

// Check current route
if (location.pathname === ROUTE_PATHS.CUSTOMER_HOME) {
  // Do something
}
```

### Sử dụng route utilities:
```tsx
import { 
  isPublicRoute, 
  buildAdminRoute, 
  customerRouteGroups 
} from "./routes";

// Check if route is public
const isPublic = isPublicRoute(path, customerRouteGroups);

// Build admin route
const adminOrdersRoute = buildAdminRoute('orders');
```

## 🔧 Route Groups

### Admin Routes (`/admin/*`)
- Dashboard
- Orders management
- Customer management
- Product management
- Store management
- Category management
- Courier management

### Customer Routes (`/foodease/*`)
- Homepage
- Restaurant listing
- Offers page
- Shopping cart
- User favorites
- User profile

### Auth Routes
- Login
- Register
- Forgot password
- Update password

### Root Routes
- Landing page
- Error pages
- Legacy redirects

## 🛠 Thêm Route mới

### 1. Thêm vào constants:
```tsx
// src/routes/index.ts
export const ROUTE_PATHS = {
  // ...existing paths
  NEW_FEATURE: '/admin/new-feature',
};
```

### 2. Thêm vào route configuration:
```tsx
// src/routes/adminRoutes.tsx
<Route path="new-feature" element={<NewFeaturePage />} />
```

### 3. Thêm resource (nếu cần):
```tsx
// src/routes/adminRoutes.tsx
export const adminResources = [
  // ...existing resources
  {
    name: "new-feature",
    list: "/admin/new-feature",
  },
];
```

## 🔍 Route Validation

Sử dụng helper functions để validate routes:

```tsx
import { isPublicRoute, isProtectedRoute } from "./routes";

// Check if user can access route
const canAccess = isPublicRoute(path, routeGroups) || 
                  (isAuthenticated && isProtectedRoute(path, routeGroups));
```

## 📝 Best Practices

1. **Luôn sử dụng constants thay vì hardcode paths**
2. **Group related routes together**
3. **Use TypeScript interfaces cho type safety**
4. **Document new routes trong README này**
5. **Test routes sau khi thay đổi**

## 🔄 Migration từ cấu trúc cũ

Cấu trúc cũ (trong App.tsx):
```tsx
<Route path="/admin/orders" element={<OrderList />} />
```

Cấu trúc mới:
```tsx
// src/routes/adminRoutes.tsx
<Route path="orders" element={<OrderList />} />

// Import trong App.tsx
{adminRoutes}
```

## 📊 Performance Benefits

- **Code splitting**: Có thể lazy load route modules
- **Bundle size**: Tách code thành chunks nhỏ hơn
- **Development**: Faster hot reload cho specific route groups
- **Type checking**: Faster TypeScript compilation

## 🚀 Next Steps

1. Implement lazy loading cho route components
2. Add route-based permissions
3. Create route middleware system
4. Add route analytics/tracking
5. Implement dynamic route generation 