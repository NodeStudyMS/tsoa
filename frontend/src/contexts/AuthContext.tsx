import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';

// 인증 컨텍스트에서 제공할 값들의 타입 정의
// 사용자 정보, 토큰, 로딩 상태 및 인증 관련 함수들 포함
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (mid: string, mpw: string) => Promise<string>; // 반환 타입 변경: 역할 문자열 반환
  register: (mid: string, mpw: string, membername: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// 인증 정보를 저장하고 공유하기 위한 Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT 토큰 디코딩 함수 (프론트엔드용)
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("토큰 디코딩 실패:", e);
    return null;
  }
}

// 인증 상태를 관리하고 자식 컴포넌트에 제공하는 Provider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 사용자 정보 상태
  const [user, setUser] = useState<User | null>(null);
  // JWT 토큰 상태
  const [token, setToken] = useState<string | null>(null);
  // 로딩 상태 (API 요청 중인지 여부)
  const [loading, setLoading] = useState(true);
  // 인증 완료 여부 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 불러와 인증 상태 초기화
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // API 요청에 토큰 설정
          api.setAuthToken(storedToken);
          setToken(storedToken);
          
          // 토큰으로 사용자 정보 조회
          const userData = await api.getMyProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // 토큰이 유효하지 않은 경우 로컬 스토리지에서 제거
          console.error('인증 초기화 실패:', error);
          localStorage.removeItem('token');
        }
      }
      
      // 초기화 완료 후 로딩 상태 해제
      setLoading(false);
    };

    initAuth();
  }, []);

  // 로그인 함수: 아이디와 비밀번호로 로그인 처리
  const login = async (mid: string, mpw: string): Promise<string> => {
    setLoading(true);
    try {
      // 로그인 API 호출하여 토큰 받기
      const token = await api.login(mid, mpw);
      localStorage.setItem('token', token);
      setToken(token);
      
      // 받은 토큰으로 사용자 정보 조회
      const userData = await api.getMyProfile();
      setUser(userData);
      setIsAuthenticated(true);
      
      // 토큰에서 역할 정보 추출
      const decoded = decodeJWT(token);
      const role = decoded?.MROLE || 'unknown';
      
      return role; // 사용자 역할 반환
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error; // 에러를 상위로 전파하여 UI에서 처리할 수 있게 함
    } finally {
      setLoading(false);
    }
  };

  // 회원가입 함수: 아이디, 비밀번호, 이름으로 회원가입 처리
  const register = async (mid: string, mpw: string, membername: string) => {
    setLoading(true);
    try {
      // 회원가입 API 호출하여 토큰 받기
      const token = await api.register(mid, mpw, membername);
      localStorage.setItem('token', token);
      setToken(token);
      
      // 받은 토큰으로 사용자 정보 조회
      const userData = await api.getMyProfile();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error; // 에러를 상위로 전파
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수: 토큰 및 사용자 정보 초기화
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    api.setAuthToken(null);
  };

  // Context Provider를 통해 인증 관련 상태와 함수들을 자식 컴포넌트에 제공
  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// 인증 컨텍스트를 쉽게 사용할 수 있는 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다');
  }
  return context;
};
