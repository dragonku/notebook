import type { OnboardingData, User } from '../types/user';
import { apiRequest } from './client';
export { ApiError } from './client';

export const userApi = {
  // 온보딩 완료
  async completeOnboarding(data: OnboardingData): Promise<User> {
    return await apiRequest<User>('/users/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 현재 사용자 정보 조회
  async getCurrentUser(): Promise<User> {
    return await apiRequest<User>('/users/me');
  },

  // 온보딩 상태 확인
  async getOnboardingStatus(): Promise<{ onboardingCompleted: boolean }> {
    return await apiRequest<{ onboardingCompleted: boolean }>('/users/onboarding-status');
  },
};

