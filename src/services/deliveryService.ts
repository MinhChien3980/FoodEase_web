import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface Delivery {
  id: number;
  orderId: number;
  restaurantName: string;
  customerAddress: string;
  deliveryPersonName: string;
  status: string;
  createdAt: string;
}

export interface DeliveryResponse {
  code: number;
  data: Delivery[];
  message?: string;
}

export interface SingleDeliveryResponse {
  code: number;
  data: Delivery;
  message?: string;
}

export interface CreateDeliveryRequest {
  orderId: number;
  status: string;
  deliveryTime: string;
}

export const deliveryService = {
  async getAllDeliveries(): Promise<Delivery[]> {
    try {
      const response: AxiosResponse<DeliveryResponse> = await apiClient.get(API_ENDPOINTS.DELIVERIES.GET_ALL);
      if (response.data.code === 200) {
        console.log(`🚚 Fetched ${response.data.data.length} deliveries successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getDeliveryById(id: number): Promise<Delivery> {
    try {
      const response: AxiosResponse<SingleDeliveryResponse> = await apiClient.get(API_ENDPOINTS.DELIVERIES.GET_BY_ID(id));
      if (response.data.code === 200) {
        console.log(`🚚 Fetched delivery ${id} successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateDeliveryStatus(id: number, status: string): Promise<Delivery> {
    try {
      const response: AxiosResponse<SingleDeliveryResponse> = await apiClient.put(
        `${API_ENDPOINTS.DELIVERIES.UPDATE_STATUS(id)}?status=${status}`
      );
      if (response.data.code === 200) {
        console.log(`🚚 Updated delivery ${id} status to ${status} successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createDelivery(deliveryRequest: CreateDeliveryRequest): Promise<Delivery> {
    try {
      const response: AxiosResponse<SingleDeliveryResponse> = await apiClient.post(
        API_ENDPOINTS.DELIVERIES.CREATE,
        deliveryRequest
      );
      if (response.data.code === 200 || response.data.code === 201) {
        console.log(`🚚 Created delivery for order ${deliveryRequest.orderId} successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}; 