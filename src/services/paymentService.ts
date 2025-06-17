import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface CreatePaymentIntentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail?: string;
  paymentMethodId?: string;
}


export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  paymentIntent: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    created: number;
    customer?: string;
    metadata: {
      orderId: string;
    };
  };
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  paymentIntent: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    payment_method: string;
    created: number;
    customer?: string;
    metadata: {
      orderId: string;
    };
  };
}

export const paymentService = {
  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      console.log("🔍 Payload gửi lên API-INTENT:", request);
      const response: AxiosResponse<PaymentIntentResponse> = await apiClient.post(
        API_ENDPOINTS.PAYMENTS.CREATE_INTENT,
        request
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async confirmPayment(request: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> {
    try {
      console.log("🔍 Payload gửi lên API-CONFIRM:", request);
      const response: AxiosResponse<ConfirmPaymentResponse> = await apiClient.post(
        API_ENDPOINTS.PAYMENTS.CONFIRM,
        request
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};
