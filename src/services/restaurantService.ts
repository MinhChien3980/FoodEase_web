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
  description?: string;
  phone: string;
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

  async getRestaurantById(id: number): Promise<Restaurant> {
    try {
      const response: AxiosResponse<SingleRestaurantResponse> = await apiClient.get(API_ENDPOINTS.RESTAURANTS.GET_BY_ID(id));
      
      if (response.data.code === 200 || response.data.code === 201) {
        console.log(`📊 Fetched restaurant ${id} successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error fetching restaurant ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  },

  async createRestaurant(data: Partial<Restaurant>): Promise<Restaurant> {
    try {
      const response: AxiosResponse<SingleRestaurantResponse> = await apiClient.post(API_ENDPOINTS.RESTAURANTS.CREATE, data);
      
      if (response.data.code === 200 || response.data.code === 201) {
        console.log('📊 Created restaurant successfully');
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw new Error(handleApiError(error));
    }
  },

  async updateRestaurant(id: number, data: Partial<Restaurant>): Promise<Restaurant> {
    try {
      const response: AxiosResponse<SingleRestaurantResponse> = await apiClient.put(API_ENDPOINTS.RESTAURANTS.UPDATE(id), data);
      
      if (response.data.code === 200) {
        console.log(`📊 Updated restaurant ${id} successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error updating restaurant ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  },

  async deleteRestaurant(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.RESTAURANTS.DELETE(id));
      
      if (response.data.code === 200) {
        console.log(`📊 Deleted restaurant ${id} successfully`);
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error deleting restaurant ${id}:`, error);
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