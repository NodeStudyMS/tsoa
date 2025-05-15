// backend/src/server.ts

import { app, initServer } from "./app";
import { createServer } from "http";
import { setupSocketServer } from "./socket/socketServer";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// HTTP 서버 생성
const httpServer = createServer(app);

// Socket.io 설정
const io = setupSocketServer(httpServer);

// 서버 초기화 및 시작
async function startServer() {
  try {
    // 서버 초기화 (데이터베이스 연결 등)
    await initServer();
    // 서버 시작
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${PORT}`);
      console.log(`Swagger UI available at http://0.0.0.0:${PORT}/docs`);
      console.log(`Socket.io 서버가 실행 중입니다`);
    });
  } catch (error) {
    console.error("서버 시작 실패:", error);
    process.exit(1);
  }
}

// 서버 시작
startServer();
