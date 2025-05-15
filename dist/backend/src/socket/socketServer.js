"use strict";
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
exports.setupSocketServer = setupSocketServer;
const socket_io_1 = require("socket.io");
const jwt_1 = require("../utils/jwt");
const ChatService_1 = require("../services/ChatService");
const MemberService_1 = require("../services/MemberService");
const chatService = new ChatService_1.ChatService();
const memberService = new MemberService_1.MemberService();
// 현재 연결된 사용자 관리
const connectedUsers = [];
function setupSocketServer(server) {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:3001", "http://127.0.0.1:3001"], // 프론트엔드 주소 (여러 형태 지원)
            methods: ["GET", "POST"],
            credentials: true, // 인증 정보 전송 허용
            allowedHeaders: ["Authorization", "Content-Type"],
        },
        allowEIO3: true, // Socket.IO v3 클라이언트 지원
        pingTimeout: 60000, // 핑 타임아웃 증가
        pingInterval: 25000, // 핑 간격 설정
    });
    // 소켓 서버 연결 로깅
    console.log("소켓 서버 설정 완료");
    // 소켓 인증 미들웨어
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("소켓 연결 시도:", socket.id);
            const token = socket.handshake.auth.token;
            console.log("인증 토큰 존재 여부:", !!token);
            if (!token) {
                console.log("인증 토큰 없음:", socket.id);
                return next(new Error("인증 토큰이 필요합니다"));
            }
            try {
                // JWT 토큰 검증
                const decoded = (0, jwt_1.verifyToken)(token);
                socket.data.user = decoded;
                console.log("인증 성공:", socket.id, decoded.MID);
                next();
            }
            catch (tokenError) {
                console.error("토큰 검증 실패:", tokenError);
                next(new Error("유효하지 않은 토큰입니다"));
            }
        }
        catch (error) {
            console.error("소켓 인증 미들웨어 오류:", error);
            next(new Error("인증 처리 중 오류가 발생했습니다"));
        }
    }));
    // 연결 이벤트 처리
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("새 소켓 연결:", socket.id);
        try {
            // 사용자 정보 가져오기
            const userId = (_a = socket.data.user) === null || _a === void 0 ? void 0 : _a.MID;
            if (!userId) {
                console.error("사용자 ID를 찾을 수 없음:", socket.id);
                socket.emit("error", { message: "사용자 정보를 찾을 수 없습니다" });
                socket.disconnect();
                return;
            }
            let member;
            try {
                member = yield memberService.getById(userId);
                console.log(`사용자 정보 조회 성공: ${member.MEMBERNAME || userId}`);
            }
            catch (memberError) {
                console.error("사용자 정보 조회 실패:", memberError);
                socket.emit("error", { message: "사용자 정보를 조회할 수 없습니다" });
                socket.disconnect();
                return;
            }
            // 연결된 사용자 목록에 추가
            connectedUsers.push({
                socketId: socket.id,
                userId: userId,
                username: member.MEMBERNAME || userId,
            });
            console.log(`현재 연결된 사용자 수: ${connectedUsers.length}`);
            // 기본 채팅방 참여
            socket.join("general");
            console.log(`사용자 ${userId} 기본 채팅방 참여`);
            io.to("general").emit("user_joined", {
                userId: userId,
                username: member.MEMBERNAME || userId,
                message: `${member.MEMBERNAME || userId}님이 입장하셨습니다`,
            });
            // 메시지 수신 및 브로드캐스트
            socket.on("send_message", (message) => __awaiter(this, void 0, void 0, function* () {
                console.log(`메시지 수신: ${socket.id}, 방: ${message.roomId || "general"}`);
                const roomId = message.roomId || "general";
                try {
                    // 메시지 저장
                    const savedMessage = yield chatService.saveMessage({
                        content: message.content,
                        senderId: userId,
                        roomId: roomId,
                    });
                    console.log(`메시지 저장 성공: ${savedMessage.id}`);
                    // 메시지 브로드캐스트
                    io.to(roomId).emit("receive_message", {
                        id: savedMessage.id,
                        content: savedMessage.content,
                        senderId: userId,
                        senderName: member.MEMBERNAME || userId,
                        roomId: roomId,
                        timestamp: savedMessage.createdAt,
                    });
                }
                catch (error) {
                    console.error("메시지 저장 실패:", error);
                    socket.emit("error", { message: "메시지 전송에 실패했습니다" });
                }
            }));
            // 채팅방 참여
            socket.on("join_room", (roomId) => {
                console.log(`사용자 ${userId} 채팅방 참여: ${roomId}`);
                socket.join(roomId);
                socket.to(roomId).emit("user_joined", {
                    userId: userId,
                    username: member.MEMBERNAME || userId,
                    message: `${member.MEMBERNAME || userId}님이 입장하셨습니다`,
                });
            });
            // 채팅방 나가기
            socket.on("leave_room", (roomId) => {
                console.log(`사용자 ${userId} 채팅방 퇴장: ${roomId}`);
                socket.leave(roomId);
                socket.to(roomId).emit("user_left", {
                    userId: userId,
                    username: member.MEMBERNAME || userId,
                    message: `${member.MEMBERNAME || userId}님이 퇴장하셨습니다`,
                });
            });
            // 연결 해제
            socket.on("disconnect", (reason) => {
                console.log(`사용자 연결 해제: ${member.MEMBERNAME || userId}, 이유: ${reason}`);
                // 연결된 사용자 목록에서 제거
                const index = connectedUsers.findIndex((user) => user.socketId === socket.id);
                if (index !== -1) {
                    connectedUsers.splice(index, 1);
                    console.log(`사용자 목록에서 제거됨, 남은 사용자 수: ${connectedUsers.length}`);
                }
                // 모든 채팅방에 사용자 퇴장 알림
                io.emit("user_left", {
                    userId: userId,
                    username: member.MEMBERNAME || userId,
                    message: `${member.MEMBERNAME || userId}님이 퇴장하셨습니다`,
                });
            });
            // 에러 처리
            socket.on("error", (error) => {
                console.error(`소켓 에러: ${socket.id}`, error);
            });
        }
        catch (error) {
            console.error("소켓 연결 처리 중 오류:", error);
            socket.emit("error", { message: "서버 오류가 발생했습니다" });
            socket.disconnect();
        }
    }));
    // 소켓 서버 에러 이벤트 처리
    io.engine.on("connection_error", (err) => {
        console.error("소켓 서버 연결 오류:", err);
    });
    return io;
}
