export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: { email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    accessTokenInfo: {
      issuedAt: number;
      expiresAt: string; // ISO date string
    };
    refreshTokenInfo: {
      issuedAt: number;
      expiresAt: string;
    };
  };
}
