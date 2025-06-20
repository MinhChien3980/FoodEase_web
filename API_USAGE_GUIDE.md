# 📚 FoodEase API Usage Guide

## 🌟 Tổng Quan

Tài liệu này hướng dẫn chi tiết cách sử dụng các API trong dự án FoodEase - một hệ thống quản lý đặt món ăn trực tuyến được xây dựng với React, Refine.dev và Material-UI.

## 🏗️ Kiến Trúc API

### Base Configuration
```typescript
// API Base URL
const API_BASE_URL = 'http://localhost:8080/api'

// Headers mặc định
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}' // Tự động thêm nếu có
}
```

### Response Format
Tất cả API responses đều tuân theo format:
```typescript
{
  code: number,      // HTTP status code (200, 400, 404, 500, etc.)
  data: T | T[],     // Dữ liệu trả về (object hoặc array)
  message?: string   // Thông báo lỗi hoặc thành công
}
```

## 🍽️ API Endpoints

### 1. Restaurant API

#### 📍 GET /restaurants/all
**Mục đích**: Lấy danh sách tất cả nhà hàng

```typescript
// Sử dụng service
import { restaurantService } from './src/services';

const fetchRestaurants = async () => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    console.log('Restaurants:', restaurants);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

**Response Example**:
```typescript
{
  code: 200,
  data: [
    {
      id: 1,
      name: "Pizza Palace",
      address: "123 Main Street, City",
      menuItems: [...]
    }
  ]
}
```

#### 📍 GET /restaurants/{id}
**Mục đích**: Lấy thông tin chi tiết một nhà hàng

```typescript
// URL: /restaurants/1
const getRestaurant = async (id: number) => {
  const response = await apiClient.get(`/restaurants/${id}`);
  return response.data;
};
```

#### 📍 POST /restaurants
**Mục đích**: Tạo nhà hàng mới

```typescript
const createRestaurant = async (restaurantData) => {
  const newRestaurant = {
    name: "New Restaurant",
    address: "456 Food Street",
    phone: "+1234567890",
    email: "contact@restaurant.com"
  };
  
  const response = await apiClient.post('/restaurants', newRestaurant);
  return response.data;
};
```

#### 📍 PUT /restaurants/{id}
**Mục đích**: Cập nhật thông tin nhà hàng

```typescript
const updateRestaurant = async (id: number, updateData) => {
  const response = await apiClient.put(`/restaurants/${id}`, updateData);
  return response.data;
};
```

#### 📍 DELETE /restaurants/{id}
**Mục đích**: Xóa nhà hàng

```typescript
const deleteRestaurant = async (id: number) => {
  const response = await apiClient.delete(`/restaurants/${id}`);
  return response.data;
};
```

### 2. Menu Items API

#### 📍 GET /menu-items/by-restaurant?restaurantId={id}
**Mục đích**: Lấy danh sách món ăn theo nhà hàng

```typescript
// Sử dụng service
const fetchMenuItems = async (restaurantId: number) => {
  try {
    const menuItems = await restaurantService.getMenuItemsByRestaurantId(restaurantId);
    console.log('Menu Items:', menuItems);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

**Response Example**:
```typescript
{
  code: 200,
  data: [
    {
      id: 1,
      restaurantId: 1,
      categoryId: 1,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato and mozzarella",
      price: 12.99,
      imageUrl: "https://example.com/pizza.jpg"
    }
  ]
}
```

#### 📍 POST /menu-items
**Mục đích**: Thêm món ăn mới

```typescript
const createMenuItem = async (menuItemData) => {
  const newMenuItem = {
    restaurantId: 1,
    categoryId: 1,
    name: "New Dish",
    description: "Delicious new dish",
    price: 15.99,
    imageUrl: "https://example.com/dish.jpg"
  };
  
  const response = await apiClient.post('/menu-items', newMenuItem);
  return response.data;
};
```

### 3. Categories API

#### 📍 GET /categories/all
**Mục đích**: Lấy danh sách tất cả danh mục

```typescript
import { categoryService } from './src/services';

const fetchCategories = async () => {
  try {
    const categories = await categoryService.getAllCategories();
    console.log('Categories:', categories);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

#### 📍 GET /categories/{id}
**Mục đích**: Lấy thông tin chi tiết một danh mục

```typescript
const getCategory = async (id: number) => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};
```

## 🔧 Cách Sử Dụng Services

### 1. Import Services
```typescript
import { 
  restaurantService, 
  categoryService, 
  apiClient, 
  handleApiError 
} from './src/services';
```

### 2. Sử dụng trong React Component
```typescript
import React, { useState, useEffect } from 'react';
import { restaurantService } from '../services';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getAllRestaurants();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {restaurants.map(restaurant => (
        <div key={restaurant.id}>
          <h3>{restaurant.name}</h3>
          <p>{restaurant.address}</p>
        </div>
      ))}
    </div>
  );
};
```

### 3. Xử Lý Authentication
```typescript
// Token được tự động thêm vào headers
// Lưu token sau khi login
localStorage.setItem('authToken', 'your-jwt-token');

// Xóa token khi logout
localStorage.removeItem('authToken');
```

## 🚨 Error Handling

### Global Error Handling
API client đã được cấu hình để xử lý lỗi tự động:

```typescript
// Các status code được xử lý tự động:
// 401: Unauthorized - Xóa token và redirect login
// 403: Forbidden access
// 404: Resource not found
// 500: Internal server error
```

### Custom Error Handling
```typescript
import { handleApiError } from './src/services';

const makeApiCall = async () => {
  try {
    const response = await apiClient.get('/some-endpoint');
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error('API Error:', errorMessage);
    // Hiển thị thông báo lỗi cho user
    showToast(errorMessage, 'error');
  }
};
```

## 🔐 Authentication & Security

### 1. JWT Token
```typescript
// Headers tự động include token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. API Key Management
```typescript
// Environment variables
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=10000
```

### 3. CORS Configuration
Backend cần cấu hình CORS cho phép requests từ frontend:
```javascript
// Backend CORS settings
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## 📊 Request/Response Interceptors

### Request Interceptor
```typescript
// Tự động log requests
apiClient.interceptors.request.use((config) => {
  console.log(`🚀 Making request to: ${config.baseURL}${config.url}`);
  
  // Thêm token tự động
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
```

### Response Interceptor
```typescript
// Xử lý responses và errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received: ${response.status}`);
    return response;
  },
  (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

## 🧪 Testing API Calls

### 1. Sử dụng Postman/Insomnia
```bash
# GET Request
GET http://localhost:8080/api/restaurants/all
Headers: 
  Content-Type: application/json
  Authorization: Bearer {your-token}

# POST Request
POST http://localhost:8080/api/restaurants
Headers:
  Content-Type: application/json
  Authorization: Bearer {your-token}
Body:
{
  "name": "Test Restaurant",
  "address": "123 Test Street"
}
```

### 2. Curl Commands
```bash
# GET Restaurants
curl -X GET "http://localhost:8080/api/restaurants/all" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}"

# Create Restaurant
curl -X POST "http://localhost:8080/api/restaurants" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"name": "New Restaurant", "address": "123 Main St"}'
```

## 🔄 Creating New API Services

### 1. Tạo Service File Mới
```typescript
// src/services/orderService.ts
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface Order {
  id: number;
  customerId: number;
  restaurantId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface OrderResponse {
  code: number;
  data: Order[];
}

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.GET_ALL);
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
```

### 2. Cập Nhật API Endpoints
```typescript
// src/config/api.ts
export const API_ENDPOINTS = {
  // ... existing endpoints
  ORDERS: {
    GET_ALL: '/orders',
    GET_BY_ID: (id: number) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: number) => `/orders/${id}`,
    DELETE: (id: number) => `/orders/${id}`,
    GET_BY_CUSTOMER: (customerId: number) => `/orders/customer/${customerId}`,
  },
};
```

### 3. Export Service
```typescript
// src/services/index.ts
export { orderService } from './orderService';
export type { Order, OrderResponse } from './orderService';
```

## 📈 Best Practices

### 1. Loading States
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await restaurantService.getAllRestaurants();
    // Handle success
  } catch (error) {
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

### 2. Error Boundaries
```typescript
import React from 'react';

class ApiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with API call</div>;
    }
    return this.props.children;
  }
}
```

### 3. Caching với React Query
```typescript
import { useQuery } from 'react-query';

const useRestaurants = () => {
  return useQuery(
    'restaurants',
    () => restaurantService.getAllRestaurants(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};
```

## 🌍 Environment Configuration

### Development
```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_DEBUG_MODE=true
```

### Production
```env
REACT_APP_API_BASE_URL=https://api.foodease.com/api
REACT_APP_DEBUG_MODE=false
```

### Staging
```env
REACT_APP_API_BASE_URL=https://staging-api.foodease.com/api
REACT_APP_DEBUG_MODE=true
```

## 🚀 Quick Start

1. **Clone và Setup**
```bash
git clone <repository>
cd FoodEase_web
npm install
```

2. **Cấu hình Environment**
```bash
cp env.example .env
# Cập nhật các giá trị trong .env
```

3. **Khởi động Backend API** (đảm bảo backend chạy trước)
```bash
# Backend cần chạy tại http://localhost:8080
```

4. **Khởi động Frontend**
```bash
npm run dev
```

5. **Test API Connections**
```typescript
// Trong browser console
import { restaurantService } from './src/services';
restaurantService.getAllRestaurants().then(console.log);
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Error**
```
Error: Access to XMLHttpRequest at 'http://localhost:8080/api/restaurants/all' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution**: Cấu hình CORS trên backend server

2. **Network Error**
```
Network error: Unable to connect to server
```
**Solution**: Kiểm tra backend server có đang chạy không

3. **401 Unauthorized**
```
Server error: 401 - Unauthorized
```
**Solution**: Kiểm tra token authentication hoặc login lại

4. **API_BASE_URL undefined**
```
TypeError: Cannot read property 'BASE_URL' of undefined
```
**Solution**: Kiểm tra file .env và restart development server
