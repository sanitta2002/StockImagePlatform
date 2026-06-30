import axiosInstance from './axiosInstance';
import { API_URLS } from '../constants/api';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(API_URLS.REGISTER, data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(API_URLS.LOGIN, data);
    return response.data;
  },

  async logout(): Promise<void> {
    // Calls the backend to clear the httpOnly refresh token cookie
    await axiosInstance.post(API_URLS.LOGOUT);
  },

  async forgotPassword(data: { email: string }): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(API_URLS.FORGOT_PASSWORD, data);
    return response.data;
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(API_URLS.RESET_PASSWORD, data);
    return response.data;
  },
};

