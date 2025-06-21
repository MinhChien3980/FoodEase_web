import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface Transaction {
  id: number;
  userId: number;
  orderId: number;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface TransactionResponse {
  code: number;
  message?: string;
  data: Transaction;
}

export interface TransactionsResponse {
  code: number;
  message?: string;
  data: Transaction[];
}

export const transactionService = {
  async getTransactionById(id: number): Promise<Transaction> {
    try {
      const response: AxiosResponse<TransactionResponse> = await apiClient.get(API_ENDPOINTS.TRANSACTIONS.GET_BY_ID(id));
      if (response.data.code === 200) {
        console.log(`💰 Fetched transaction ${id} successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  },

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const response: AxiosResponse<TransactionsResponse> = await apiClient.get(API_ENDPOINTS.TRANSACTIONS.GET_ALL);
      console.log('Raw API response:', response.data);
      if (response.data.code === 200) {
        console.log(`💰 Fetched ${response.data.data.length} transactions successfully`);
        console.log('Transaction data:', response.data.data);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error(handleApiError(error));
    }
  },

  async getTransactionsByOrderId(orderId: number): Promise<Transaction[]> {
    try {
      const response: AxiosResponse<TransactionsResponse> = await apiClient.get(API_ENDPOINTS.TRANSACTIONS.GET_BY_ORDER(orderId));
      if (response.data.code === 200) {
        console.log(`💰 Fetched transactions for order ${orderId} successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error fetching transactions for order ${orderId}:`, error);
      throw new Error(handleApiError(error));
    }
  },

  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const response: AxiosResponse<TransactionResponse> = await apiClient.post(API_ENDPOINTS.TRANSACTIONS.CREATE, transaction);
      if (response.data.code === 200 || response.data.code === 201) {
        console.log(`💰 Created transaction successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error(handleApiError(error));
    }
  },

  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const response: AxiosResponse<TransactionResponse> = await apiClient.put(API_ENDPOINTS.TRANSACTIONS.UPDATE(id), transaction);
      if (response.data.code === 200) {
        console.log(`💰 Updated transaction ${id} successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error updating transaction ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  }
}; 