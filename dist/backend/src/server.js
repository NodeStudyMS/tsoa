"use strict";
// backend/src/server.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http_1 = require("http");
const socketServer_1 = require("./socket/socketServer");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// HTTP 서버 생성
const httpServer = (0, http_1.createServer)(app_1.app);
// Socket.io 설정
const io = (0, socketServer_1.setupSocketServer)(httpServer);
// 서버 초기화 및 시작
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 서버 초기화 (데이터베이스 연결 등)
            yield (0, app_1.initServer)();
            // 서버 시작
            httpServer.listen(PORT, "0.0.0.0", () => {
                console.log(`Server is running on http://0.0.0.0:${PORT}`);
                console.log(`Swagger UI available at http://0.0.0.0:${PORT}/docs`);
                console.log(`Socket.io 서버가 실행 중입니다`);
            });
        }
        catch (error) {
            console.error("서버 시작 실패:", error);
            process.exit(1);
        }
    });
}
// 서버 시작
startServer();
