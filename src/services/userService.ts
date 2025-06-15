import { AxiosResponse } from 'axios';
import apiClient, { handleApiResponse, handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface ProfileResponse {
    code: number;
    message?: string;
    data: {
        id: number;
        email: string;
        fullName: string;
        phone: string;
        cityId: number;
        langKey: string;
        login: string;
    };
}

export interface UpdateProfileRequest {
    fullName?: string;
    phone?: string;
    cityId?: number;
    langKey?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    login: string;
    activated: boolean;
}

export interface UserResponse {
    data: User[];
    message: string;
    status: number;
}

export const userService = {
    getProfile: async (): Promise<ProfileResponse> => {
        try {
            const response: AxiosResponse<ProfileResponse> = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
    
    updateProfile: async (userId: number, data: UpdateProfileRequest): Promise<ProfileResponse> => {
        try {
            const response: AxiosResponse<ProfileResponse> = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(userId), data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    getAllUsers: async (): Promise<UserResponse> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USERS.GET_ALL);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    getUserById: async (id: number): Promise<User> => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.USERS.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, userData);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
        try {
            const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    deleteUser: async (id: number): Promise<void> => {
        try {
            await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    updateUserStatus: async (id: number, status: string): Promise<User> => {
        try {
            const response = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE_STATUS(id), { status });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};



