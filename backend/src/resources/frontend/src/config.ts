// 프로젝트 전역 설정 파일
// 환경 변수가 있으면 사용하고, 없으면 기본값 사용

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "";

// 개발 환경에서는 로그 출력
if (process.env.NODE_ENV !== "production") {
  console.log("API URL:", API_BASE_URL);
  console.log("Socket URL:", SOCKET_URL);
}
