import { api } from './api';
import { AuthTokens, LoginCredentials } from '../types/auth';
import { setTokens, removeTokens } from '../utils/tokenStorage';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      const response = await api.post('/login', credentials);
      const tokens = response.data;
      setTokens(tokens);
      return tokens;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Credenciais inválidas');
      }
      throw new Error('Erro ao tentar fazer login. Tente novamente.');
    }
  },

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const response = await api.post('/refresh-token', { token });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error('Erro ao atualizar a sessão');
    }
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_refresh_token');
      if (token) {
        await api.post('/logout', { token });
      }
    } finally {
      removeTokens();
      window.location.href = '/login';
    }
  }
};