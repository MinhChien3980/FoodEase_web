import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import { Restaurant } from './restaurantService';
import { MenuItem } from '../interfaces/menuItem';

export interface ToggleFavoriteRequest {
  favoritableType: 'restaurant' | 'menu_item';
  favoritableId: number;
}

export interface ToggleFavoriteResponse {
  code: number;
  message: string;
  data: {
    favoritableId: number;
    favoritableType: 'restaurant' | 'menu_item';
    isFavorite: boolean;
  };
}

export interface GetFavoritesResponse {
  code: number;
  message: string | null;
  data: {
    restaurants: Restaurant[];
    menu_items: MenuItem[];
  };
}

export const favoriteService = {
  toggleFavorite: async (
    request: ToggleFavoriteRequest
  ): Promise<{
    favoritableId: number;
    favoritableType: "restaurant" | "menu_item";
    isFavorite: boolean;
  }> => {
    const response = await apiClient.post(API_ENDPOINTS.FAVORITES.TOGGLE, request);
    return response.data;
  },

  toggleRestaurantFavorite: async (restaurantId: number) => {
    return favoriteService.toggleFavorite({
      favoritableId: restaurantId,
      favoritableType: "restaurant",
    });
  },

  toggleMenuItemFavorite: async (menuItemId: number) => {
    return favoriteService.toggleFavorite({
      favoritableId: menuItemId,
      favoritableType: "menu_item",
    });
  },

  getFavorites: async (): Promise<{
    restaurants: Restaurant[];
    menu_items: MenuItem[];
  }> => {
    try {
      const response: AxiosResponse<GetFavoritesResponse> = await apiClient.get(API_ENDPOINTS.FAVORITES.GET_ALL);
      if (response.data.code === 200) {
        console.log(`❤️ Fetched user favorites`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw new Error(handleApiError(error));
    }
  }
}; 