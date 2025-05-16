"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
// frontend/src/services/socketService.ts
const socket_io_client_1 = require("socket.io-client");
class SocketService {
    constructor() {
        this.socket = null;
        this.url = "";
    }
    // 소켓 연결 부분
    connect(token) {
        if (this.socket) {
            this.socket.disconnect();
        }
        this.socket = (0, socket_io_client_1.io)(this.url, {
            auth: { token },
            transports: ["polling", "websocket"],
            forceNew: true,
            reconnectionAttempts: 5,
            timeout: 10000,
            withCredentials: true, // 인증 정보 전송 허용
        });
        this.socket.on("connect", () => {
            console.log("소켓 서버에 연결되었습니다");
        });
        this.socket.on("connect_error", (error) => {
            console.error("소켓 연결 오류:", error.message);
            // 디버깅을 위한 추가 정보 출력
            console.error("연결 오류 상세 정보:", error);
        });
        return this.socket;
    }
    // 소켓 연결 해제
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
    // 채팅방 참여
    joinRoom(roomId) {
        if (this.socket) {
            this.socket.emit("join_room", roomId);
        }
    }
    // 채팅방 나가기
    leaveRoom(roomId) {
        if (this.socket) {
            this.socket.emit("leave_room", roomId);
        }
    }
    // 메시지 전송
    sendMessage(content, roomId = "general") {
        if (this.socket) {
            this.socket.emit("send_message", { content, roomId });
        }
    }
    // 메시지 수신 이벤트 리스너
    onReceiveMessage(callback) {
        if (this.socket) {
            this.socket.on("receive_message", callback);
        }
        return () => {
            if (this.socket) {
                this.socket.off("receive_message", callback);
            }
        };
    }
    // 사용자 입장 이벤트 리스너
    onUserJoined(callback) {
        if (this.socket) {
            this.socket.on("user_joined", callback);
        }
        return () => {
            if (this.socket) {
                this.socket.off("user_joined", callback);
            }
        };
    }
    // 사용자 퇴장 이벤트 리스너
    onUserLeft(callback) {
        if (this.socket) {
            this.socket.on("user_left", callback);
        }
        return () => {
            if (this.socket) {
                this.socket.off("user_left", callback);
            }
        };
    }
    // 에러 이벤트 리스너
    onError(callback) {
        if (this.socket) {
            this.socket.on("error", callback);
        }
        return () => {
            if (this.socket) {
                this.socket.off("error", callback);
            }
        };
    }
    // 연결 상태 확인
    isConnected() {
        var _a;
        return ((_a = this.socket) === null || _a === void 0 ? void 0 : _a.connected) || false;
    }
}
exports.socketService = new SocketService();
