import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number | null;
}

export interface OrderItemResponse {
  code: number;
  data: OrderItem[];
  message?: string;
}

export const orderItemService = {
  getOrderItemsByOrderId: async (orderId: number): Promise<OrderItem[]> => {
    try {
      const response: AxiosResponse<OrderItemResponse> = await apiClient.get(
        API_ENDPOINTS.ORDER_ITEMS.GET_BY_ORDER_ID(orderId)
      );
      
      if (response.data.code === 200) {
        console.log('Order item response:', response.data);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error('Error fetching order item:', error);
      throw new Error(handleApiError(error));
    }
  }
}; 