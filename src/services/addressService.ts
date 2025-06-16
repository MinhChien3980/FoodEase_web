import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface Address {
  id: number;
  userId: number;
  addressLine: string;
  area: string;
  cityId: number;
}

export interface AddressResponse {
  code: number;
  data: Address;
  message?: string;
}

export interface AddressesResponse {
  code: number;
  data: Address[];
  message?: string;
}

export const addressService = {
  createAddress: async (address: Omit<Address, 'id'>): Promise<AddressResponse> => {
    try {
      const response: AxiosResponse<AddressResponse> = await apiClient.post(
        API_ENDPOINTS.ADDRESSES.CREATE,
        address
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAddressesByUser: async (userId: number): Promise<AddressesResponse> => {
    try {
      const response: AxiosResponse<AddressesResponse> = await apiClient.get(
        API_ENDPOINTS.ADDRESSES.GET_BY_USER(userId)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteAddress: async (addressId: number): Promise<AddressResponse> => {
    try {
      const response: AxiosResponse<AddressResponse> = await apiClient.delete(
        API_ENDPOINTS.ADDRESSES.DELETE(addressId)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}; 