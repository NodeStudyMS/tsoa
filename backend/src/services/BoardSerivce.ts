// src/services/BoardService.ts

import { Board, BoardCreationParams, BoardUpdateParams, BoardModel } from '../models/Board';

export class BoardService {
  // 모든 게시글 조회 (최신순)
  public async getAll(): Promise<Board[]> {
    const boards = await BoardModel.findAll({
      order: [['BID', 'DESC']]
    });
    
    // Sequelize 모델을 Board 인터페이스 형태로 변환
    return boards.map(board => ({
      BID: board.BID,
      BOARDTITLE: board.BOARDTITLE,
      BOARDCONTENT: board.BOARDCONTENT,
      BOARDREGDATE: board.BOARDREGDATE.toISOString(),
      MEMBERNAME: board.MEMBERNAME
    }));
  }

  // 특정 게시글 조회
  public async getById(id: number): Promise<Board> {
    const board = await BoardModel.findByPk(id);
    
    if (!board) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
    
    return {
      BID: board.BID,
      BOARDTITLE: board.BOARDTITLE,
      BOARDCONTENT: board.BOARDCONTENT,
      BOARDREGDATE: board.BOARDREGDATE.toISOString(),
      MEMBERNAME: board.MEMBERNAME
    };
  }

  // 게시글 생성
  public async create(boardParams: BoardCreationParams): Promise<Board> {
    const newBoard = await BoardModel.create({
      BOARDTITLE: boardParams.BOARDTITLE,
      BOARDCONTENT: boardParams.BOARDCONTENT,
      MEMBERNAME: boardParams.MEMBERNAME
    });
    
    return {
      BID: newBoard.BID,
      BOARDTITLE: newBoard.BOARDTITLE,
      BOARDCONTENT: newBoard.BOARDCONTENT,
      BOARDREGDATE: newBoard.BOARDREGDATE.toISOString(),
      MEMBERNAME: newBoard.MEMBERNAME
    };
  }

  // 게시글 수정
  public async update(id: number, boardParams: BoardUpdateParams): Promise<Board> {
    const board = await BoardModel.findByPk(id);
    
    if (!board) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
    
    const updateData: BoardUpdateParams = {};
    
    if (boardParams.BOARDTITLE !== undefined) {
      updateData.BOARDTITLE = boardParams.BOARDTITLE;
    }
    
    if (boardParams.BOARDCONTENT !== undefined) {
      updateData.BOARDCONTENT = boardParams.BOARDCONTENT;
    }
    
    if (boardParams.MEMBERNAME !== undefined) {
      updateData.MEMBERNAME = boardParams.MEMBERNAME;
    }
    
    // 수정할 데이터가 없으면 현재 정보 반환
    if (Object.keys(updateData).length === 0) {
      return {
        BID: board.BID,
        BOARDTITLE: board.BOARDTITLE,
        BOARDCONTENT: board.BOARDCONTENT,
        BOARDREGDATE: board.BOARDREGDATE.toISOString(),
        MEMBERNAME: board.MEMBERNAME
      };
    }
    
    await board.update(updateData);
    
    return {
      BID: board.BID,
      BOARDTITLE: board.BOARDTITLE,
      BOARDCONTENT: board.BOARDCONTENT,
      BOARDREGDATE: board.BOARDREGDATE.toISOString(),
      MEMBERNAME: board.MEMBERNAME
    };
  }

  // 게시글 삭제
  public async delete(id: number): Promise<void> {
    const result = await BoardModel.destroy({
      where: { BID: id }
    });
    
    if (result === 0) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
  }
}
