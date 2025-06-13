import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Restaurant API service
export interface MenuItem {
  id: number;
  restaurantId: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
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

export interface MenuItemsResponse {
  code: number;
  data: MenuItem[];
}

// Single menu item response interface
export interface MenuItemResponse {
  code: number;
  data: MenuItem;
  message?: string;
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

  async getMenuItemsByRestaurantId(restaurantId: number): Promise<MenuItem[]> {
    try {
      const response: AxiosResponse<MenuItemsResponse> = await apiClient.get(API_ENDPOINTS.MENU_ITEMS.GET_BY_RESTAURANT_ID(restaurantId));
      
      if (response.data.code === 200) {
        console.log(`🍽️ Fetched ${response.data.data.length} menu items for restaurant ${restaurantId}`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error fetching menu items for restaurant ${restaurantId}:`, error);
      throw new Error(handleApiError(error));
    }
  },

  // Lấy thông tin chi tiết menu item theo ID
  async getMenuItemById(menuItemId: number): Promise<MenuItem> {
    try {
      const response: AxiosResponse<MenuItemResponse> = await apiClient.get(API_ENDPOINTS.MENU_ITEMS.GET_BY_ID(menuItemId));
      
      if (response.data.code === 200) {
        console.log(`🍽️ Fetched menu item ${menuItemId}:`, response.data.data.name);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error fetching menu item ${menuItemId}:`, error);
      throw new Error(handleApiError(error));
    }
  },

}; 