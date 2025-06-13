import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
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
    };
}

export interface UpdateProfileRequest {
    fullName: string;
    phone: string;
    cityId: number;
    langKey: string;
}

export const userService = {
    getProfile: async (): Promise<ProfileResponse> => {
        const response: AxiosResponse<ProfileResponse> = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
        return response.data;
    },
    
    updateProfile: async (userId: number, data: UpdateProfileRequest): Promise<ProfileResponse> => {
        const response: AxiosResponse<ProfileResponse> = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(userId), data);
        return response.data;
    }
};  



