// backend/src/controllers/BoardControllers.ts

// tsoa 라이브러리에서 필요한 데코레이터 import
import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Response,
  Tags,
} from "tsoa";
// Board.ts 인터페이스 import
import { Board, BoardCreationParams, BoardUpdateParams } from "../models/Board";
// BoardSerivce를 import 하고 실제 비즈니스 로직 처리
import { BoardService } from "../services/BoardSerivce";

// C의 기본경로를 /api/boards로 설정
@Route("api/boards")
// Swagger 문서에서 Board 태그로 그룹화
@Tags("Board")
export class BoardController extends Controller {
  private service: BoardService = new BoardService();

  // 모든 게시글 조회 (GET 요청)
  @Get()
  public async getBoards(): Promise<Board[]> {
    return this.service.getAll();
  }

  // 특정 게시글 조회 (GET 요청)
  @Get("{boardId}")
  // URL 경로에서 boardID 추출 후 게시글 하나 반환
  public async getBoard(@Path() boardId: number): Promise<Board> {
    return this.service.getById(boardId);
  }

  // 게시글 생성 (POST 요청)
  @Post()
  // @Body()는 요청 본문에서 게시글 생성에 필요한 데이터를 가져옴
  public async createBoard(
    @Body() requestBody: BoardCreationParams
  ): Promise<Board> {
    // 새로 생성된 게시글 정보를 반환함
    return this.service.create(requestBody);
  }

  // 게시글 수정 (PUT 요청)
  @Put("{boardId}")
  public async updateBoard(
    // 게시글 ID와 수정할 내용을 받아와 수정함
    @Path() boardId: number,
    @Body() requestBody: BoardUpdateParams
  ): Promise<Board> {
    // 수정된 게시글 정보 반환
    return this.service.update(boardId, requestBody);
  }

  // 게시글 삭제 (DELETE 요청)
  @Delete("{boardId}") // /api/board/1, /api/board/2
  @Response("204", "No Content") // 삭제 성공 시 204 반환
  public async deleteBoard(@Path() boardId: number): Promise<void> {
    return this.service.delete(boardId);
  }
}
