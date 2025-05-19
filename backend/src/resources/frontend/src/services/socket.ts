// frontend/src/services/socketService.ts
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client/build/esm/socket";
import { ChatMessage, UserJoinedEvent, UserLeftEvent } from "../types";
import { SOCKET_URL } from "../config";

class SocketService {
  private socket: Socket | null = null;
  // config.ts에서 가져온 소켓 URL 사용
  private readonly url = SOCKET_URL;
  
  // 소켓 연결 부분
  connect(token: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    console.log("소켓 서버 URL:", this.url); // 디버깅용 로그
    this.socket = io(this.url, {
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

    this.socket.on("connect_error", (error: Error) => {
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
  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit("join_room", roomId);
    }
  }

  // 채팅방 나가기
  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit("leave_room", roomId);
    }
  }

  // 메시지 전송
  sendMessage(content: string, roomId: string = "general") {
    if (this.socket) {
      this.socket.emit("send_message", { content, roomId });
    }
  }

  // 메시지 수신 이벤트 리스너
  onReceiveMessage(callback: (message: ChatMessage) => void) {
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
  onUserJoined(callback: (data: UserJoinedEvent) => void) {
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
  onUserLeft(callback: (data: UserLeftEvent) => void) {
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
  onError(callback: (error: { message: string }) => void) {
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
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
export const socketService = new SocketService();