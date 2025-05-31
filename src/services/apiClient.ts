import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request Interceptor (chạy trước mỗi request)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making request to: ${config.baseURL}${config.url}`);
    
    // Tự động thêm token nếu có
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor (chạy sau mỗi response)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ Response received: ${response.status} ${response.statusText}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response error:', error);
    
    // Global error handling
    if (error.response) {
      // Server responded with error status
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      
      // Handle specific status codes globally
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login
          console.warn('Unauthorized access - clearing auth token');
          localStorage.removeItem('authToken');
          // window.location.href = '/login'; // Uncomment if needed
          break;
        case 403:
          console.warn('Forbidden access');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      return `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
    } else if (error.request) {
      // Request was made but no response received
      return 'Network error: Unable to connect to server. Please check if the API server is running.';
    } else {
      // Something else happened
      return `Request error: ${error.message}`;
    }
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

export default apiClient; 