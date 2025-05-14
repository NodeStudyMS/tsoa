import 'express';

// Express 모듈의 타입 확장 선언
declare global {
  // Express 네임스페이스 내부에 있는 타입 확장
  namespace Express {
    // Request 인터페이스에 user 속성 추가
    // JWT 인증 미들웨어에서 디코딩된 사용자 정보를 저장하는 용도
    // 인증된 사용자가 없을 경우 undefined일 수 있으므로 옵셔널(?) 처리
    interface Request {
      user?: any; // 사용자 정보를 any 타입으로 저장
    }
  }
}
