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
    items: OrderItem[];
  };
}

export interface Order {
  id: number;
  userId: number;
  activeStatus: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  code: number;
  data: Order[];
  message?: string;
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

  getOrdersByUserId: async (userId: number): Promise<Order[]> => {
    try {
      const response: AxiosResponse<OrdersResponse> = await apiClient.get(
        API_ENDPOINTS.ORDERS.GET_BY_USER(userId)
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getOrderById: async (orderId: number): Promise<Order> => {
    try {
      const response: AxiosResponse<OrderResponse> = await apiClient.get(
        API_ENDPOINTS.ORDERS.GET_BY_ID(orderId)
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getAllOrders: async (): Promise<Order[]> => {
    try {
      const response: AxiosResponse<OrdersResponse> = await apiClient.get(
        API_ENDPOINTS.ORDERS.GET_ALL
      );
      
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}; 