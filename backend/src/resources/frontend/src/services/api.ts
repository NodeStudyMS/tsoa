// frontend/src/services/api.ts

import axios from "axios";
import { ChatRoom, ChatMessage, User } from "../types";
import { API_BASE_URL } from "../config";

// API 서버 URL 설정 (config.ts에서 가져옴)
const API_URL = API_BASE_URL;

console.log("API URL 사용:", API_URL); // 디버깅용 로그

// 인증 토큰을 헤더에 추가하는 함수
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// 로그인 API
export const login = async (mid: string, mpw: string): Promise<string> => {
  try {
    console.log(`로그인 요청 URL: ${API_URL}/members/login`);
    const response = await axios.post(`${API_URL}/members/login`, {
      MID: mid,
      MPW: mpw,
    });
    const token = response.data;
    setAuthToken(token);
    return token;
  } catch (error) {
    console.error("로그인 API 오류:", error);
    throw error;
  }
};

// 회원가입 API
export const register = async (
  mid: string,
  mpw: string,
  membername: string
): Promise<string> => {
  try {
    console.log(`회원가입 요청 URL: ${API_URL}/members/register`);
    const response = await axios.post(`${API_URL}/members/register`, {
      MID: mid,
      MPW: mpw,
      MEMBERNAME: membername,
    });
    const token = response.data;
    setAuthToken(token);
    return token;
  } catch (error) {
    console.error("회원가입 API 오류:", error);
    throw error;
  }
};

// 내 프로필 조회 API
export const getMyProfile = async (): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/members/me/profile`);
    return response.data;
  } catch (error) {
    console.error("프로필 조회 API 오류:", error);
    throw error;
  }
};

// 채팅방 목록 조회 API
export const getChatRooms = async (): Promise<ChatRoom[]> => {
  try {
    const response = await axios.get(`${API_URL}/chat/rooms`);
    return response.data;
  } catch (error) {
    console.error("채팅방 목록 조회 API 오류:", error);
    throw error;
  }
};

// 특정 채팅방 메시지 조회 API
export const getChatMessages = async (
  roomId: string
): Promise<ChatMessage[]> => {
  try {
    const response = await axios.get(`${API_URL}/chat/rooms/${roomId}/messages`);
    return response.data;
  } catch (error) {
    console.error("채팅방 메시지 조회 API 오류:", error);
    throw error;
  }
};

export default {
  login,
  register,
  getMyProfile,
  getChatRooms,
  getChatMessages,
  setAuthToken,
};