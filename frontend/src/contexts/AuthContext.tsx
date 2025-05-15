import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (mid: string, mpw: string) => Promise<void>;
  register: (mid: string, mpw: string, membername: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          api.setAuthToken(storedToken);
          setToken(storedToken);
          
          const userData = await api.getMyProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('인증 초기화 실패:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (mid: string, mpw: string) => {
    setLoading(true);
    try {
      const token = await api.login(mid, mpw);
      localStorage.setItem('token', token);
      setToken(token);
      
      const userData = await api.getMyProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (mid: string, mpw: string, membername: string) => {
    setLoading(true);
    try {
      const token = await api.register(mid, mpw, membername);
      localStorage.setItem('token', token);
      setToken(token);
      
      const userData = await api.getMyProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    api.setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다');
  }
  return context;
};
