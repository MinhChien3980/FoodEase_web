import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

// Category API service
export interface Category {
  id: number;
  restaurantId: number;
  name: string;
}

export interface CategoryResponse {
  code: number;
  data: Category[];
}

export interface SingleCategoryResponse {
  code: number;
  data: Category;
}

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    try {
      const response: AxiosResponse<CategoryResponse> = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
      
      if (response.data.code === 200) {
        console.log(`📂 Fetched ${response.data.data.length} categories successfully`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error(handleApiError(error));
    }
  },

  async getCategoryById(id: number): Promise<Category> {
    try {
      const response: AxiosResponse<SingleCategoryResponse> = await apiClient.get(API_ENDPOINTS.CATEGORIES.GET_BY_ID(id));
      
      if (response.data.code === 200) {
        console.log(`📂 Fetched category: ${response.data.data.name}`);
        return response.data.data;
      } else {
        throw new Error(`API error! code: ${response.data.code}`);
      }
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw new Error(handleApiError(error));
    }
  }
}; 