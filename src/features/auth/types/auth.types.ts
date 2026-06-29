export type UserRole = 'admin' | 'manager' | 'employee';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  department: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RefreshResponse {
  accessToken: string;
}
