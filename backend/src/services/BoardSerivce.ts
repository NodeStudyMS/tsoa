// src/services/BoardService.ts

import { Board, BoardCreationParams, BoardUpdateParams, BoardModel } from '../models/Board';

export class BoardService {
  // 모든 게시글 조회 (최신순으로 정렬)
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

  // 특정 ID의 게시글 상세 조회
  public async getById(id: number): Promise<Board> {
    const board = await BoardModel.findByPk(id);
    
    // 게시글이 없으면 에러 발생
    if (!board) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
    
    // Sequelize 모델을 Board 인터페이스로 변환하여 반환
    return {
      BID: board.BID,
      BOARDTITLE: board.BOARDTITLE,
      BOARDCONTENT: board.BOARDCONTENT,
      BOARDREGDATE: board.BOARDREGDATE.toISOString(),
      MEMBERNAME: board.MEMBERNAME
    };
  }

  // 새 게시글 생성 처리 메소드
  public async create(boardParams: BoardCreationParams): Promise<Board> {
    // 새 게시글 데이터 저장
    const newBoard = await BoardModel.create({
      BOARDTITLE: boardParams.BOARDTITLE,
      BOARDCONTENT: boardParams.BOARDCONTENT,
      MEMBERNAME: boardParams.MEMBERNAME
    });
    
    // 생성된 게시글 데이터를 Board 인터페이스로 변환하여 반환
    return {
      BID: newBoard.BID,
      BOARDTITLE: newBoard.BOARDTITLE,
      BOARDCONTENT: newBoard.BOARDCONTENT,
      BOARDREGDATE: newBoard.BOARDREGDATE.toISOString(),
      MEMBERNAME: newBoard.MEMBERNAME
    };
  }

  // 게시글 수정 처리 메소드
  public async update(id: number, boardParams: BoardUpdateParams): Promise<Board> {
    const board = await BoardModel.findByPk(id);
    
    // 게시글이 없으면 에러 발생
    if (!board) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
    
    const updateData: BoardUpdateParams = {};
    
    // 제목 변경 요청이 있으면 업데이트 데이터에 추가
    if (boardParams.BOARDTITLE !== undefined) {
      updateData.BOARDTITLE = boardParams.BOARDTITLE;
    }
    
    // 내용 변경 요청이 있으면 업데이트 데이터에 추가
    if (boardParams.BOARDCONTENT !== undefined) {
      updateData.BOARDCONTENT = boardParams.BOARDCONTENT;
    }
    
    // 작성자명 변경 요청이 있으면 업데이트 데이터에 추가
    if (boardParams.MEMBERNAME !== undefined) {
      updateData.MEMBERNAME = boardParams.MEMBERNAME;
    }
    
    // 변경할 데이터가 없으면 현재 정보 반환
    if (Object.keys(updateData).length === 0) {
      return {
        BID: board.BID,
        BOARDTITLE: board.BOARDTITLE,
        BOARDCONTENT: board.BOARDCONTENT,
        BOARDREGDATE: board.BOARDREGDATE.toISOString(),
        MEMBERNAME: board.MEMBERNAME
      };
    }
    
    // 게시글 정보 업데이트 후 결과 반환
    await board.update(updateData);
    
    return {
      BID: board.BID,
      BOARDTITLE: board.BOARDTITLE,
      BOARDCONTENT: board.BOARDCONTENT,
      BOARDREGDATE: board.BOARDREGDATE.toISOString(),
      MEMBERNAME: board.MEMBERNAME
    };
  }

  // 게시글 삭제 메소드 ID로 게시글 삭제
  public async delete(id: number): Promise<void> {
    const result = await BoardModel.destroy({
      where: { BID: id }
    });
    
    // 삭제할 게시글이 없으면 에러 발생
    if (result === 0) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
  }
}
