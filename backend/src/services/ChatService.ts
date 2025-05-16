// backend/src/services/ChatService.ts

import { ChatMessage, ChatMessageCreationParams } from "../models/ChatMessage";
import { ChatRoom, ChatRoomCreationParams } from "../models/ChatRoom";
import { Member } from "../models/Member";

export class ChatService {
  // 채팅방 생성
  public async createRoom(
    roomParams: ChatRoomCreationParams
  ): Promise<ChatRoom> {
    return await ChatRoom.create(roomParams);
  }

  // 모든 채팅방 조회
  public async getAllRooms(): Promise<ChatRoom[]> {
    return await ChatRoom.findAll();
  }

  // 특정 채팅방 조회
  public async getRoomById(roomId: string): Promise<ChatRoom> {
    const room = await ChatRoom.findByPk(roomId);
    if (!room) {
      throw new Error(`채팅방 ID ${roomId}를 찾을 수 없습니다`);
    }
    return room;
  }

  // 메시지 저장
  public async saveMessage(
    messageParams: ChatMessageCreationParams
  ): Promise<ChatMessage> {
    return await ChatMessage.create(messageParams);
  }

  // 특정 채팅방의 메시지 조회
  public async getMessagesByRoomId(
    roomId: string,
    limit: number = 50
  ): Promise<ChatMessage[]> {
    return await ChatMessage.findAll({
      where: { roomId },
      include: [
        {
          model: Member,
          as: "sender",
          attributes: ["MID", "MEMBERNAME"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
    });
  }

  // 기본 채팅방 생성 (서버 시작 시 호출)
  public async initializeDefaultRooms(): Promise<void> {
    const defaultRooms = [
      { id: "general", name: "일반", description: "모든 주제에 대한 대화" },
      { id: "tech", name: "기술", description: "기술 관련 대화" },
      { id: "random", name: "랜덤", description: "자유로운 대화" },
    ];

    for (const room of defaultRooms) {
      const existingRoom = await ChatRoom.findByPk(room.id);
      if (!existingRoom) {
        await ChatRoom.create(room);
        console.log(`채팅방 생성: ${room.name}`);
      }
    }
  }
}
