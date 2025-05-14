// backend/src/authentication.ts - 사용자 인증을 처리

import * as express from 'express';
import * as jwt from 'jsonwebtoken';

// JWT 토큰 생성/검증에 사용할 비밀키
const JWT_SECRET = 'your-secret-key';

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  // JWT 인증 방식인 경우
  if (securityName === 'jwt') {
    // Authorization 헤더에서 Bearer 토큰 추출
    const token = request.headers['authorization']?.split(' ')[1];
    
    return new Promise((resolve, reject) => {
      // 토큰이 없는 경우 인증 실패
      if (!token) {
        reject(new Error('인증 토큰이 없습니다'));
        return;
      }

      // JWT 토큰 검증
      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          // 토큰이 유효하지 않은 경우 (만료, 서명 불일치 등)
          reject(err);
        } else {
          // 권한(스코프) 확인이 필요한 경우
          if (scopes && scopes.length > 0) {
            const userRole = decoded.role;
            
            // 사용자의 역할이 요구되는 스코프에 포함되지 않으면 접근 거부
            if (!scopes.includes(userRole)) {
              reject(new Error('권한이 없습니다'));
              return;
            }
          }
          
          // 인증된 사용자 정보를 request 객체에 저장 (컨트롤러에서 접근 가능)
          request.user = decoded;
          resolve(decoded);
        }
      });
    });
  }
  
  // JWT 이외의 인증 방식은 지원하지 않음
  return Promise.reject(new Error('유효하지 않은 인증 방식입니다'));
}

export const promiseAny = (promises: Promise<any>[]) => {
  return new Promise((resolve, reject) => {
    let errors: Error[] = [];
    let pending = promises.length;
    
    // 빈 배열이 전달된 경우 즉시 에러 반환
    if (pending === 0) {
      reject(new AggregateError([], 'All promises were rejected'));
      return;
    }
    
    // 모든 Promise를 순회하며 처리
    promises.forEach(promise => {
      promise.then(
        // 하나라도 성공하면 즉시 그 결과 반환
        result => resolve(result),
        // 실패하면 에러를 모으고, 모두 실패한 경우에만 에러 반환
        error => {
          errors.push(error);
          if (--pending === 0) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
};

class AggregateError extends Error {
  errors: Error[];
  
  constructor(errors: Error[], message: string) {
    super(message);
    this.name = 'AggregateError';
    this.errors = errors;
  }
}
