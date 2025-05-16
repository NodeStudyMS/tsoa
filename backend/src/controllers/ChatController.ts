// backend/src/controllers/ChatController.ts
import {
  Controller,
  Get,
  Path,
  Route,
  Response,
  Tags,
  Security,
  Request,
} from "tsoa";
import { ChatService } from "../services/ChatService";
import { IChatRoom } from "../models/ChatRoom";
import { IChatMessage } from "../models/ChatMessage";
import * as express from "express";
@Route("api/chat")
@Tags("Chat")
export class ChatController extends Controller {
  private service: ChatService = new ChatService();

  // 채팅방 목록을 전부 가져오는 API
  // JWT 토큰으로 인증된 사용자만 접근 가능
  @Get("rooms")
  @Security("jwt")
  public async getChatRooms(
    @Request() request: express.Request
  ): Promise<IChatRoom[]> {
    return await this.service.getAllRooms();
  }
  // 특정 ID의 채팅방 정보를 조회하는 API
  // 채팅방 ID를 경로 파라미터로 받음
  // JWT 토큰으로 인증된 사용자만 접근 가능
  @Get("rooms/{roomId}")
  @Security("jwt")
  public async getChatRoom(
    @Path() roomId: string,
    @Request() request: express.Request
  ): Promise<IChatRoom> {
    return await this.service.getRoomById(roomId);
  }
  // 특정 채팅방의 메시지 내역을 조회하는 API
  // 채팅방 ID를 경로 파라미터로 받아서 해당 방의 메시지만 가져옴
  // JWT 토큰으로 인증된 사용자만 접근 가능
  @Get("rooms/{roomId}/messages")
  @Security("jwt")
  public async getChatMessages(
    @Path() roomId: string,
    @Request() request: express.Request
  ): Promise<IChatMessage[]> {
    return await this.service.getMessagesByRoomId(roomId);
  }
}
