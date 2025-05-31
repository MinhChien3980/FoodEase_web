import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Restaurant API service
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  menuItems: MenuItem[];
}

export interface RestaurantResponse {
  code: number;
  data: Restaurant[];
}

export interface SingleRestaurantResponse {
  code: number;
  data: Restaurant;
}

export const restaurantService = {
  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      const response: AxiosResponse<RestaurantResponse> = await apiClient.get(API_ENDPOINTS.RESTAURANTS.GET_ALL);
      
      if (response.data.code === 200) {
        console.log(`📊 Fetched ${response.data.data.length} restaurants successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw new Error(handleApiError(error));
    }
  },

//   async getRestaurantById(id: number): Promise<Restaurant> {
//     try {
//       const response: AxiosResponse<SingleRestaurantResponse> = await apiClient.get(API_ENDPOINTS.RESTAURANTS.GET_BY_ID(id));
      
//       if (response.data.code === 200) {
//         console.log(`🏪 Fetched restaurant: ${response.data.data.name}`);
//         return response.data.data;
//       } else {
//         throw new Error(`API error! code: ${response.data.code}`);
//       }
//     } catch (error) {
//       console.error(`Error fetching restaurant with ID ${id}:`, error);
//       throw new Error(handleApiError(error));
//     }
//   },

//   async createRestaurant(restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> {
//     try {
//       const response: AxiosResponse<SingleRestaurantResponse> = await apiClient.post(API_ENDPOINTS.RESTAURANTS.CREATE, restaurant);
      
//       if (response.data.code === 200 || response.data.code === 201) {
//         console.log(`🏪 Created restaurant: ${response.data.data.name}`);
//         return response.data.data;
//       } else {
//         throw new Error(`API error! code: ${response.data.code}`);
//       }
//     } catch (error) {
//       console.error('Error creating restaurant:', error);
//       throw new Error(handleApiError(error));
//     }
//   },

//   async updateRestaurant(id: number, restaurant: Partial<Restaurant>): Promise<Restaurant> {
//     try {
//       const response: AxiosResponse<SingleRestaurantResponse> = await apiClient.put(API_ENDPOINTS.RESTAURANTS.UPDATE(id), restaurant);
      
//       if (response.data.code === 200) {
//         console.log(`🏪 Updated restaurant: ${response.data.data.name}`);
//         return response.data.data;
//       } else {
//         throw new Error(`API error! code: ${response.data.code}`);
//       }
//     } catch (error) {
//       console.error(`Error updating restaurant with ID ${id}:`, error);
//       throw new Error(handleApiError(error));
//     }
//   },

//   async deleteRestaurant(id: number): Promise<void> {
//     try {
//       const response: AxiosResponse<{ code: number; message: string }> = await apiClient.delete(API_ENDPOINTS.RESTAURANTS.DELETE(id));
      
//       if (response.data.code === 200) {
//         console.log(`🗑️ Deleted restaurant with ID: ${id}`);
//       } else {
//         throw new Error(`API error! code: ${response.data.code}`);
//       }
//     } catch (error) {
//       console.error(`Error deleting restaurant with ID ${id}:`, error);
//       throw new Error(handleApiError(error));
//     }
//   }
}; 