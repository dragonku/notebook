export interface User {
  id: number;
  email: string;
  nickname: string;
  favoriteGenres: string[];
  readingGoalMonthly?: number;
  privacyLevel: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthError {
  error: string;
  message: string;
  timestamp: string;
}

export interface CheckResponse {
  available: boolean;
  message: string;
}