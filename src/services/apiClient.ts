import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../config/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Create a separate public API client that doesn't require authentication
const publicApiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Request Interceptor for authenticated requests (chạy trước mỗi request)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making authenticated request to: ${config.baseURL}${config.url}`);
    
    // Tự động thêm token nếu có - sử dụng customer_token từ sessionStorage
    const token = sessionStorage.getItem('customer_token');
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

// Request Interceptor for public requests (no authentication)
publicApiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making public request to: ${config.baseURL}${config.url}`);
    // No authentication token added for public requests
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Public request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor (chạy sau mỗi response) - same for both clients
const responseInterceptor = (response: AxiosResponse) => {
  console.log(`✅ Response received: ${response.status} ${response.statusText}`);
  return response;
};

const errorInterceptor = (error: AxiosError) => {
  console.error('❌ Response error:', error);
  
  // Global error handling
  if (error.response) {
    // Server responded with error status
    console.error('Error data:', error.response.data);
    console.error('Error status:', error.response.status);
    
    // Handle specific status codes globally
    switch (error.response.status) {
      case 401:
        // Unauthorized - clear customer session
        console.warn('Unauthorized access - clearing customer session');
        sessionStorage.removeItem('customer_token');
        sessionStorage.removeItem('customer_user');
        // window.location.href = '/foodease/login'; // Uncomment if needed
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
};

// Apply response interceptors to both clients
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);
publicApiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

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
export { publicApiClient }; 