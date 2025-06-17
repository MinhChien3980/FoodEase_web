import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  orderId: string;
  customerEmail?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const paymentService = {
  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      const response: AxiosResponse<PaymentIntentResponse> = await apiClient.post(
        API_ENDPOINTS.PAYMENTS.CREATE_INTENT,
        request
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async confirmPayment(paymentIntentId: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await apiClient.post(
        API_ENDPOINTS.PAYMENTS.CONFIRM,
        { paymentIntentId }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}; 