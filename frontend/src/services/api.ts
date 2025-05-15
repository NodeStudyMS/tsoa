import axios from 'axios';
import { ChatRoom, ChatMessage, User } from '../types';

const API_URL = 'http://localhost:3000';

// 인증 토큰을 헤더에 추가하는 함수
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// 로그인 API
export const login = async (mid: string, mpw: string): Promise<string> => {
  const response = await axios.post(`${API_URL}/members/login`, { MID: mid, MPW: mpw });
  const token = response.data;
  setAuthToken(token);
  return token;
};

// 회원가입 API
export const register = async (mid: string, mpw: string, membername: string): Promise<string> => {
  const response = await axios.post(`${API_URL}/members/register`, { 
    MID: mid, 
    MPW: mpw, 
    MEMBERNAME: membername 
  });
  const token = response.data;
  setAuthToken(token);
  return token;
};

// 내 프로필 조회 API
export const getMyProfile = async (): Promise<User> => {
  const response = await axios.get(`${API_URL}/members/me/profile`);
  return response.data;
};

// 채팅방 목록 조회 API
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  const response = await axios.get(`${API_URL}/chat/rooms`);
  return response.data;
};

// 특정 채팅방 메시지 조회 API
export const getChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const response = await axios.get(`${API_URL}/chat/rooms/${roomId}/messages`);
  return response.data;
};

export default {
  login,
  register,
  getMyProfile,
  getChatRooms,
  getChatMessages,
  setAuthToken
};
