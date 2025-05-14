// src/utils/jwt.ts

import jwt from 'jsonwebtoken';
import { IMember } from '../models/Member';

// JWT 시크릿 키
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export interface TokenPayload {
  MID: string;
  MEMBERNAME: string | null;
  MROLE: string;
}

// JWT 토큰 생성 함수 - IMember 타입을 그대로 받도록 수정
export const generateToken = (user: IMember): string => {
  const payload: TokenPayload = {
    MID: user.MID,
    MEMBERNAME: user.MEMBERNAME,
    MROLE: user.MROLE
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// JWT 토큰 검증 함수
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
