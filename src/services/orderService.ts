import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { ORDER_STATUS } from '../constants';

export interface OrderItem {
  menuItemId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: number;
  totalPrice: number;
  items: OrderItem[];
  activeStatus: typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
}

export interface OrderResponse {
  code: number;
  message?: string;
  data: {
    id: number;
    userId: number;
    totalPrice: number;
    activeStatus: typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
    createdAt: string;
  };
}

export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<OrderResponse> => {
    try {
      const response: AxiosResponse<OrderResponse> = await apiClient.post(
        API_ENDPOINTS.ORDERS.CREATE,
        request
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

}; 