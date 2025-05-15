// backend/src/controllers/ChatController.ts


import { Controller, Get, Path, Route, Response, Tags, Security, Request } from 'tsoa';
import { ChatService } from '../services/ChatService';
import { IChatRoom } from '../models/ChatRoom';
import { IChatMessage } from '../models/ChatMessage';
import * as express from 'express';

@Route('chat')
@Tags('Chat')
export class ChatController extends Controller {
  private service: ChatService = new ChatService();

  // 모든 채팅방 목록 조회
  @Get('rooms')
  @Security('jwt')
  public async getChatRooms(@Request() request: express.Request): Promise<IChatRoom[]> {
    return await this.service.getAllRooms();
  }

  // 특정 채팅방 정보 조회
  @Get('rooms/{roomId}')
  @Security('jwt')
  public async getChatRoom(
    @Path() roomId: string,
    @Request() request: express.Request
  ): Promise<IChatRoom> {
    return await this.service.getRoomById(roomId);
  }

  // 특정 채팅방의 메시지 조회
  @Get('rooms/{roomId}/messages')
  @Security('jwt')
  public async getChatMessages(
    @Path() roomId: string,
    @Request() request: express.Request
  ): Promise<IChatMessage[]> {
    return await this.service.getMessagesByRoomId(roomId);
  }
}
