// src/controllers/BoardControllers.ts

import { Body, Controller, Delete, Get, Path, Post, Put, Route, Response, Tags } from 'tsoa';
import { Board, BoardCreationParams, BoardUpdateParams } from '../models/Board';
import { BoardService } from '../services/BoardSerivce';

@Route('boards')
@Tags('Board')
export class BoardController extends Controller {
  private service: BoardService = new BoardService();

  @Get()
  public async getBoards(): Promise<Board[]> {
    return this.service.getAll();
  }

  @Get('{boardId}')
  public async getBoard(@Path() boardId: number): Promise<Board> {
    return this.service.getById(boardId);
  }

  @Post()
  public async createBoard(@Body() requestBody: BoardCreationParams): Promise<Board> {
    return this.service.create(requestBody);
  }

  @Put('{boardId}')
  public async updateBoard(
    @Path() boardId: number,
    @Body() requestBody: BoardUpdateParams
  ): Promise<Board> {
    return this.service.update(boardId, requestBody);
  }

  @Delete('{boardId}')
  @Response('204', 'No Content')
  public async deleteBoard(@Path() boardId: number): Promise<void> {
    return this.service.delete(boardId);
  }
}
