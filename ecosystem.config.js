module.exports = {
  apps: [
    {
      name: "tsoa-api",
      script: "./dist/backend/src/server.js", // 빌드된 서버 진입점
      instances: "max", // CPU 코어 수만큼 인스턴스 생성
      exec_mode: "cluster", // 클러스터 모드로 실행
      env: {
        NODE_ENV: "production",
        PORT: 3000, // 백엔드 API 서버 포트
      },
      watch: false, // 파일 변경 감지 비활성화
      max_memory_restart: "500M", // 메모리 제한
    },
  ],
};
