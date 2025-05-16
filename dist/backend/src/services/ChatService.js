"use strict";
// backend/src/services/ChatService.ts
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
exports.ChatService = void 0;
const ChatMessage_1 = require("../models/ChatMessage");
const ChatRoom_1 = require("../models/ChatRoom");
const Member_1 = require("../models/Member");
class ChatService {
    // 채팅방 생성
    createRoom(roomParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChatRoom_1.ChatRoom.create(roomParams);
        });
    }
    // 모든 채팅방 조회
    getAllRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChatRoom_1.ChatRoom.findAll();
        });
    }
    // 특정 채팅방 조회
    getRoomById(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield ChatRoom_1.ChatRoom.findByPk(roomId);
            if (!room) {
                throw new Error(`채팅방 ID ${roomId}를 찾을 수 없습니다`);
            }
            return room;
        });
    }
    // 메시지 저장
    saveMessage(messageParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChatMessage_1.ChatMessage.create(messageParams);
        });
    }
    // 특정 채팅방의 메시지 조회
    getMessagesByRoomId(roomId_1) {
        return __awaiter(this, arguments, void 0, function* (roomId, limit = 50) {
            return yield ChatMessage_1.ChatMessage.findAll({
                where: { roomId },
                include: [
                    {
                        model: Member_1.Member,
                        as: "sender",
                        attributes: ["MID", "MEMBERNAME"],
                    },
                ],
                order: [["createdAt", "DESC"]],
                limit,
            });
        });
    }
    // 기본 채팅방 생성 (서버 시작 시 호출)
    initializeDefaultRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultRooms = [
                { id: "general", name: "일반", description: "모든 주제에 대한 대화" },
                { id: "tech", name: "기술", description: "기술 관련 대화" },
                { id: "random", name: "랜덤", description: "자유로운 대화" },
            ];
            for (const room of defaultRooms) {
                const existingRoom = yield ChatRoom_1.ChatRoom.findByPk(room.id);
                if (!existingRoom) {
                    yield ChatRoom_1.ChatRoom.create(room);
                    console.log(`채팅방 생성: ${room.name}`);
                }
            }
        });
    }
}
exports.ChatService = ChatService;
