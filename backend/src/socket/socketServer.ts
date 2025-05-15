import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";
import { verifyToken } from "../utils/jwt";
import { ChatService } from "../services/ChatService";
import { MemberService } from "../services/MemberService";

const chatService = new ChatService();
const memberService = new MemberService();

// 소켓 연결 사용자 목록
interface ConnectedUser {
  socketId: string;
  userId: string;
  username: string;
}

// 현재 연결된 사용자 관리
const connectedUsers: ConnectedUser[] = [];

export function setupSocketServer(server: Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:3001", // 프론트엔드 주소 명시적 지정
      methods: ["GET", "POST"],
      credentials: true, // 인증 정보 전송 허용
    },
  });

  // 소켓 인증 미들웨어
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("인증 토큰이 필요합니다"));
      }

      // JWT 토큰 검증
      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error("인증에 실패했습니다"));
    }
  });

  io.on("connection", async (socket) => {
    try {
      const userId = socket.data.user.MID;
      const member = await memberService.getById(userId);

      console.log(`사용자 연결: ${member.MEMBERNAME || userId}`);

      // 연결된 사용자 목록에 추가
      connectedUsers.push({
        socketId: socket.id,
        userId: userId,
        username: member.MEMBERNAME || userId,
      });

      // 기본 채팅방 참여
      socket.join("general");
      io.to("general").emit("user_joined", {
        userId: userId,
        username: member.MEMBERNAME || userId,
        message: `${member.MEMBERNAME || userId}님이 입장하셨습니다`,
      });

      // 메시지 수신 및 브로드캐스트
      socket.on(
        "send_message",
        async (message: { content: string; roomId?: string }) => {
          const roomId = message.roomId || "general";

          try {
            // 메시지 저장
            const savedMessage = await chatService.saveMessage({
              content: message.content,
              senderId: userId,
              roomId: roomId,
            });

            // 메시지 브로드캐스트
            io.to(roomId).emit("receive_message", {
              id: savedMessage.id,
              content: savedMessage.content,
              senderId: userId,
              senderName: member.MEMBERNAME || userId,
              roomId: roomId,
              timestamp: savedMessage.createdAt,
            });
          } catch (error) {
            console.error("메시지 저장 실패:", error);
            socket.emit("error", { message: "메시지 전송에 실패했습니다" });
          }
        }
      );

      // 채팅방 참여
      socket.on("join_room", (roomId: string) => {
        socket.join(roomId);
        socket.to(roomId).emit("user_joined", {
          userId: userId,
          username: member.MEMBERNAME || userId,
          message: `${member.MEMBERNAME || userId}님이 입장하셨습니다`,
        });
      });

      // 채팅방 나가기
      socket.on("leave_room", (roomId: string) => {
        socket.leave(roomId);
        socket.to(roomId).emit("user_left", {
          userId: userId,
          username: member.MEMBERNAME || userId,
          message: `${member.MEMBERNAME || userId}님이 퇴장하셨습니다`,
        });
      });

      // 연결 해제
      socket.on("disconnect", () => {
        console.log(`사용자 연결 해제: ${member.MEMBERNAME || userId}`);

        // 연결된 사용자 목록에서 제거
        const index = connectedUsers.findIndex(
          (user) => user.socketId === socket.id
        );
        if (index !== -1) {
          connectedUsers.splice(index, 1);
        }

        // 모든 채팅방에 사용자 퇴장 알림
        io.emit("user_left", {
          userId: userId,
          username: member.MEMBERNAME || userId,
          message: `${member.MEMBERNAME || userId}님이 퇴장하셨습니다`,
        });
      });
    } catch (error) {
      console.error("소켓 연결 처리 중 오류:", error);
      socket.disconnect();
    }
  });

  return io;
}
