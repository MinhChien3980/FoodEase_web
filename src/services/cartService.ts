import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

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

    // Kiểm tra và tạo cart nếu chưa có
    getOrCreateCart: async (userId: number): Promise<Cart> => {
        try {
            // Thử lấy cart hiện có
            const cartResponse = await cartService.getCartByUser(userId);
            return cartResponse.data;
        } catch (error) {
            // Nếu không có cart (404) hoặc lỗi khác, tạo cart mới
            console.log('Cart not found, creating new cart for user:', userId);
            try {
                const newCartResponse = await cartService.createCart(userId);
                return newCartResponse.data;
            } catch (createError) {
                throw new Error(`Failed to create cart: ${handleApiError(createError)}`);
            }
        }
    },
}; 