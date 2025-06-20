import { AxiosResponse } from 'axios';
import apiClient, { handleApiError } from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    cityId: number;
    langKey: string;
    login?: string;
    activated?: boolean;
}

export interface LoginResponse {
    code: number;
    message?: string;
    data: {
        authenticated: boolean;
        token: string;
    };
}

export interface RegisterResponse {
    code: number;
    data: {
        token: string;
    };
}   

export interface AuthUser {
    id: number;
    email: string;
    fullName: string;
    phone: string;
    cityId: number;
    langKey: string;
}

export const authService = {
    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const response: AxiosResponse<LoginResponse> = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, request);
        return response.data;
    },
    register: async (request: RegisterRequest): Promise<RegisterResponse> => {
        const registerData = {
            ...request,
            activated: true,
            login: "customer"
        };
        const response: AxiosResponse<RegisterResponse> = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, registerData);
        return response.data;
    },
};

