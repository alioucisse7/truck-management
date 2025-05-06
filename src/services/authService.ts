
import api from './api';

export type UserRole = 'admin' | 'manager' | 'driver';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  companyName?: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  companyName: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProfileUpdateData {
  name: string;
  email: string;
  phone?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    return response.data.user;
  },
  
  async signup(userData: SignupData): Promise<User> {
    const response = await api.post<AuthResponse>('/auth/signup', userData);
    localStorage.setItem(TOKEN_KEY, response.data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    return response.data.user;
  },
  
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async updateProfile(data: ProfileUpdateData): Promise<User> {
    const response = await api.put<User>('/profile', data);
    
    // Update the stored user data with the new information
    const updatedUser = response.data;
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  async changePassword(data: PasswordChangeData): Promise<void> {
    await api.put('/profile/password', data);
  }
};
