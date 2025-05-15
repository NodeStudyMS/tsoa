"use strict";
// backend/src/server.ts
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http_1 = require("http");
const socketServer_1 = require("./socket/socketServer");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// HTTP 서버 생성
const httpServer = (0, http_1.createServer)(app_1.app);
// Socket.io 설정
const io = (0, socketServer_1.setupSocketServer)(httpServer);
// 서버 시작
httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Swagger UI available at http://0.0.0.0:${PORT}/api-docs`);
    console.log(`Socket.io 서버가 실행 중입니다`);
});
