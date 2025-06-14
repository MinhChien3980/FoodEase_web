// Export API Client
export { default as apiClient } from './apiClient';
export { handleApiError, handleApiResponse } from './apiClient';

// Export Services
export { restaurantService } from './restaurantService';
export { categoryService } from './categoryService';
export { authService } from './authService';
export { userService } from './userService';
export { cartService } from './cartService';
export { addressService } from './addressService';

// Export Types
export type { 
  Restaurant, 
  MenuItem, 
  RestaurantResponse,
  SingleRestaurantResponse,
  MenuItemsResponse,
  MenuItemResponse
} from './restaurantService';

export type {
  Category,
  CategoryResponse,
  SingleCategoryResponse
} from './categoryService';

export type {
  City,
  CityResponse
} from './cityService';

export type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from './authService';

export type {
  ProfileResponse
} from './userService';

export type {
  Cart,
  CartItem,
  CartResponse,
  CreateCartResponse,
  ApiCartItem,
  CartItemsApiResponse,
  AddCartItemRequest,
  AddCartItemResponse,
  UpdateCartItemRequest,
  UpdateCartItemResponse,
  DeleteCartItemResponse
} from './cartService';

export type { Address, AddressResponse, AddressesResponse } from './addressService';

