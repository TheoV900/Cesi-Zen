// frontend/contexts/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

type User = { id: number; email: string; role: string };
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.access_token);
    const payload = JSON.parse(atob(data.access_token.split('.')[1]));
    const u = { id: payload.sub, email: payload.email, role: payload.role };
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const register = async (email: string, password: string) => {
    const { data } = await api.post('/auth/register', { email, password });
    localStorage.setItem('token', data.access_token);
    const payload = JSON.parse(atob(data.access_token.split('.')[1]));
    const u = { id: payload.sub, email: payload.email, role: payload.role };
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const resetPassword = async (oldPassword: string, newPassword: string) => {
    await api.patch('/auth/reset-password', { oldPassword, newPassword });
    logout();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
