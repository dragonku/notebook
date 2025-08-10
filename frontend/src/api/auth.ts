import type { AuthResponse, LoginRequest, SignupRequest, RefreshTokenRequest, CheckResponse } from '../types/auth';
import { apiRequest } from './client';
export { ApiError } from './client';

export const authApi = {
  // 회원가입
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiRequest<{ data: AuthResponse }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // 로그인
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<{ data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // 토큰 갱신
  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const response = await apiRequest<{ data: AuthResponse }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  // 로그아웃
  async logout(refreshToken: string): Promise<void> {
    await apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  // 이메일 중복 체크
  async checkEmail(email: string): Promise<CheckResponse> {
    return await apiRequest<CheckResponse>(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    );
  },

  // 닉네임 중복 체크
  async checkNickname(nickname: string): Promise<CheckResponse> {
    return await apiRequest<CheckResponse>(
      `/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`
    );
  },
};

