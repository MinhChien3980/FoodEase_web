import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { restaurantService } from './restaurantService';
import { ICartItem } from '../interfaces';

export interface CartItem {
    id: number;
    menuItemId: number;
    quantity: number;
    price: number;
    menuItem?: {
        id: number;
        name: string;
        price: number;
        imageUrl?: string;
    };
}

// New interface for API cart item response
export interface ApiCartItem {
    id: number;
    cartId: number;
    menuItemId: number;
    quantity: number;
}

// New interface for API response
export interface CartItemsApiResponse {
    code: number;
    data: ApiCartItem[];
    message?: string;
}

// Interface for adding cart item request
export interface AddCartItemRequest {
    cartId: number;
    menuItemId: number;
    quantity: number;
}

// Interface for add cart item response
export interface AddCartItemResponse {
    code: number;
    data: ApiCartItem;
    message?: string;
}

// Interface for updating cart item request
export interface UpdateCartItemRequest {
    quantity: number;
}

// Interface for update cart item response  
export interface UpdateCartItemResponse {
    code: number;
    data: ApiCartItem;
    message?: string;
}

// Interface for delete cart item response
export interface DeleteCartItemResponse {
    code: number;
    message?: string;
}

export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CartResponse {
    code: number;
    message?: string;
    data: Cart;
}

export interface CreateCartResponse {
    code: number;
    message?: string;
    data: Cart;
}

export const cartService = {
    // Lấy cart theo userId
    getCartByUser: async (userId: number): Promise<CartResponse> => {
        try {
            const response: AxiosResponse<CartResponse> = await apiClient.get(
                API_ENDPOINTS.CART.GET_BY_USER(userId)
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Tạo cart mới cho user
    createCart: async (userId: number): Promise<CreateCartResponse> => {
        try {
            const response: AxiosResponse<CreateCartResponse> = await apiClient.post(
                API_ENDPOINTS.CART.CREATE(userId)
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Lấy cart items theo cartId
    getCartItems: async (cartId: number): Promise<CartItemsApiResponse> => {
        try {
            const response: AxiosResponse<CartItemsApiResponse> = await apiClient.get(
                API_ENDPOINTS.CART.GET_ITEMS(cartId)
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    // Thêm cart item vào server
    addCartItem: async (request: AddCartItemRequest): Promise<AddCartItemResponse> => {
        try {
            console.log(`🛒 Adding item to cart:`, request);
            const response: AxiosResponse<AddCartItemResponse> = await apiClient.post(
                API_ENDPOINTS.CART.ADD_ITEM,
                request
            );
            
            if (response.data.code === 201) {
                console.log(`✅ Successfully added item to cart:`, response.data.data);
                return response.data;
            } else {
                throw new Error(`API error! code: ${response.data.code}`);
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw new Error(handleApiError(error));
        }
    },

    // Cập nhật quantity của cart item trên server
    updateCartItem: async (cartItemId: number, request: UpdateCartItemRequest): Promise<UpdateCartItemResponse> => {
        try {
            console.log(`🔄 Updating cart item ${cartItemId} quantity to:`, request.quantity);
            const response: AxiosResponse<UpdateCartItemResponse> = await apiClient.put(
                API_ENDPOINTS.CART.UPDATE_ITEM(cartItemId),
                request
            );
            
            if (response.data.code === 200) {
                console.log(`✅ Successfully updated cart item:`, response.data.data);
                return response.data;
            } else {
                throw new Error(`API error! code: ${response.data.code}`);
            }
        } catch (error) {
            console.error(`Error updating cart item ${cartItemId}:`, error);
            throw new Error(handleApiError(error));
        }
    },

    // Xóa cart item khỏi server
    deleteCartItem: async (cartItemId: number): Promise<DeleteCartItemResponse> => {
        try {
            console.log(`🗑️ Deleting cart item ${cartItemId}`);
            const response: AxiosResponse<DeleteCartItemResponse> = await apiClient.delete(
                API_ENDPOINTS.CART.DELETE_ITEM(cartItemId)
            );
            
            if (response.data.code === 200) {
                console.log(`✅ Successfully deleted cart item ${cartItemId}`);
                return response.data;
            } else {
                throw new Error(`API error! code: ${response.data.code}`);
            }
        } catch (error) {
            console.error(`Error deleting cart item ${cartItemId}:`, error);
            throw new Error(handleApiError(error));
        }
    },

    // Kiểm tra và tạo cart nếu chưa có
    getOrCreateCart: async (userId: number): Promise<Cart> => {
        try {
            console.log(`🔍 Checking for existing cart for user ${userId}...`);
            // Thử lấy cart hiện có từ server
            const cartResponse = await cartService.getCartByUser(userId);
            console.log(`✅ Found existing cart ${cartResponse.data.id} for user ${userId}`);
            return cartResponse.data;
        } catch (error) {
            // Nếu không có cart (404) hoặc lỗi khác, tạo cart mới
            console.log(`📝 Cart not found for user ${userId}, creating new cart...`);
            try {
                const newCartResponse = await cartService.createCart(userId);
                console.log(`✅ Created new cart ${newCartResponse.data.id} for user ${userId}`);
                return newCartResponse.data;
            } catch (createError) {
                console.error(`❌ Failed to create cart for user ${userId}:`, createError);
                throw new Error(`Failed to create cart: ${handleApiError(createError)}`);
            }
        }
    },

    // Load cart items với thông tin đầy đủ của menu items (dùng khi login)
    loadCartItemsWithDetails: async (cartId: number): Promise<ICartItem[]> => {
        try {
            console.log(`🛒 Loading cart items for cart ${cartId}...`);
            
            // Lấy cart items từ API
            const cartItemsResponse = await cartService.getCartItems(cartId);
            
            if (cartItemsResponse.code !== 200) {
                throw new Error(`API error! code: ${cartItemsResponse.code}`);
            }

            const apiCartItems = cartItemsResponse.data;
            console.log(`Found ${apiCartItems.length} items in cart`);

            if (apiCartItems.length === 0) {
                return [];
            }

            // Load restaurants data once để cache
            const restaurantsPromise = restaurantService.getAllRestaurants();
            
            // Load all menu items trong parallel
            const menuItemsPromises = apiCartItems.map(apiItem => 
                restaurantService.getMenuItemById(apiItem.menuItemId)
            );

            // Wait for both restaurants và menu items cùng lúc
            const [restaurants, menuItems] = await Promise.all([
                restaurantsPromise,
                Promise.all(menuItemsPromises.map(promise => 
                    promise.catch(error => {
                        console.error('Failed to load menu item:', error);
                        return null; // Return null for failed items
                    })
                ))
            ]);

            // Create restaurant lookup map
            const restaurantMap = new Map(restaurants.map(r => [r.id, r.name]));
            
            // Build cart items với thông tin đầy đủ
            const cartItemsWithDetails: ICartItem[] = [];
            
            for (let i = 0; i < apiCartItems.length; i++) {
                const apiItem = apiCartItems[i];
                const menuItem = menuItems[i];
                
                if (menuItem) {
                    const restaurantName = restaurantMap.get(menuItem.restaurantId) || `Restaurant ${menuItem.restaurantId}`;
                    
                    const cartItem: ICartItem = {
                        id: menuItem.id,
                        name: menuItem.name,
                        description: menuItem.description,
                        price: menuItem.price,
                        imageUrl: menuItem.imageUrl,
                        categoryId: menuItem.categoryId,
                        restaurantId: menuItem.restaurantId,
                        restaurantName: restaurantName,
                        quantity: apiItem.quantity,
                    };
                    
                    cartItemsWithDetails.push(cartItem);
                }
            }

            console.log(`✅ Successfully loaded ${cartItemsWithDetails.length} cart items with details`);
            
            // Deduplicate items in case server returns duplicates
            const deduplicatedItems = cartItemsWithDetails.reduce((acc, item) => {
                const existingIndex = acc.findIndex(existing => 
                    existing.id === item.id && existing.restaurantId === item.restaurantId
                );
                
                if (existingIndex > -1) {
                    // Item already exists, combine quantities
                    acc[existingIndex].quantity += item.quantity;
                    console.log(`🔄 Merged duplicate item ${item.name}, new quantity: ${acc[existingIndex].quantity}`);
                } else {
                    // New item, add to result
                    acc.push(item);
                }
                
                return acc;
            }, [] as ICartItem[]);
            
            if (deduplicatedItems.length !== cartItemsWithDetails.length) {
                console.log(`🔀 Deduplicated cart items: ${cartItemsWithDetails.length} -> ${deduplicatedItems.length}`);
            }
            
            return deduplicatedItems;
            
        } catch (error) {
            console.error('Error loading cart items with details:', error);
            throw new Error(handleApiError(error));
        }
    },

    // Tìm cart item ID bằng menu item ID
    findCartItemIdByMenuItemId: async (cartId: number, menuItemId: number): Promise<number | null> => {
        try {
            const cartItemsResponse = await cartService.getCartItems(cartId);
            
            if (cartItemsResponse.code === 200) {
                const cartItem = cartItemsResponse.data.find(item => item.menuItemId === menuItemId);
                return cartItem ? cartItem.id : null;
            }
            
            return null;
        } catch (error) {
            console.error(`Error finding cart item ID for menu item ${menuItemId}:`, error);
            return null;
        }
    },
}; 