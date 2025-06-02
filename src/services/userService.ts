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
        const response: AxiosResponse<ProfileResponse> = await apiClient.get('/api/users/profile');
        return response.data;
    },
    
    updateProfile: async (request: UpdateProfileRequest): Promise<ProfileResponse> => {
        const response: AxiosResponse<ProfileResponse> = await apiClient.put('/api/users/profile', request);
        return response.data;
    },
};  



