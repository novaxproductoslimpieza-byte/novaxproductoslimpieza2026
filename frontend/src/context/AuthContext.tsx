'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, userApi } from '../lib/api';

interface User {
  id: number;
  nombre: string;
  rol: 'CLIENTE' | 'ADMINISTRADOR';
  correo?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (ci_or_correo: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('novax_token');
    if (savedToken) {
      setToken(savedToken);
      userApi.getProfile()
        .then(setUser)
        .catch(() => { localStorage.removeItem('novax_token'); })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (ci_or_correo: string, password: string) => {
    const data = await authApi.login({ ci_or_correo, password });
    localStorage.setItem('novax_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData: any) => {
    const data = await authApi.register(formData);
    localStorage.setItem('novax_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('novax_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAdmin: user?.rol === 'ADMINISTRADOR' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
