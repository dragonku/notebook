import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest, SignupRequest } from '../types/auth';
import { authApi, ApiError } from '../api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokenFn: () => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
}

export const useAuth = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (data: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authApi.login(data);
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // localStorage에도 토큰 저장 (API 요청시 사용)
          localStorage.setItem('accessToken', response.accessToken);
          
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : '로그인 중 오류가 발생했습니다';
          
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          throw error;
        }
      },

      signup: async (data: SignupRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authApi.signup(data);
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('accessToken', response.accessToken);
          
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : '회원가입 중 오류가 발생했습니다';
          
          set({
            error: errorMessage,
            isLoading: false,
          });
          
          throw error;
        }
      },

      logout: async () => {
        try {
          const { refreshToken } = get();
          
          if (refreshToken) {
            await authApi.logout(refreshToken);
          }
        } catch (error) {
          console.error('로그아웃 API 호출 실패:', error);
        } finally {
          // API 실패와 관계없이 로컬 상태 클리어
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
          
          localStorage.removeItem('accessToken');
        }
      },

      refreshTokenFn: async (): Promise<boolean> => {
        try {
          const { refreshToken } = get();
          
          if (!refreshToken) {
            return false;
          }

          const response = await authApi.refreshToken({ refreshToken });
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
          });

          localStorage.setItem('accessToken', response.accessToken);
          
          return true;
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          
          // 토큰 갱신 실패시 로그아웃
          get().logout();
          return false;
        }
      },

      clearError: () => set({ error: null }),
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);