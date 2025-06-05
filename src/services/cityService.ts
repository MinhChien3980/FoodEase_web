import { AxiosResponse } from 'axios';
import apiClient, { handleApiError, publicApiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface City {
    id: number;
    name: string;
}

export interface CityResponse {
    code: number;
    data: City[];
}

export const cityService = {
    async getAllCities(): Promise<City[]> {
        try {
          const response: AxiosResponse<CityResponse> = await publicApiClient.get(API_ENDPOINTS.CITIES.GET_ALL);
          
          if (response.data.code === 200) {
            console.log(`📊 Fetched ${response.data.data.length} cities successfully`);
            return response.data.data;
          } else {
            throw new Error(`API error! code: ${response.data.code}`);
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
          throw new Error(handleApiError(error));
        }
      },
    
}

