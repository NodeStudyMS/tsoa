// src/services/BoardSerivce.ts

// db 연결 메서드 import
import db from '../db/db';
// 게시판 관련 인터페이스 import
import { Board, BoardCreationParams, BoardUpdateParams } from '../models/Board';

export class BoardService {
  // 게시글 ID 기준 내림차순 정렬(최신순)
  // 배열반환
  public async getAll(): Promise<Board[]> {
    return await db.query('SELECT * FROM board ORDER BY BID DESC');
  }

  // 특정 게시글 조회
  public async getById(id: number): Promise<Board> {
    // ?와 [id] : SQL 인젝션 공격 방지를 위한 파라미터 바인딩
    const result = await db.query('SELECT * FROM board WHERE BID = ?', [id]);
    // 예외처리
    if (result.length === 0) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
    return result[0];
  }

  // 게시글 추가
  public async create(boardParams: BoardCreationParams): Promise<Board> {
    const result = await db.query(
      'INSERT INTO board (BOARDTITLE, BOARDCONTENT, MEMBERNAME) VALUES (?, ?, ?)',
      [boardParams.BOARDTITLE, boardParams.BOARDCONTENT, boardParams.MEMBERNAME]
    );
    
    // 생성된 게시글 전체 정보를 조회하고 반환
    return this.getById(result.insertId);
  }

  // 게시글 수정
  public async update(id: number, boardParams: BoardUpdateParams): Promise<Board> {
    // 수정할 필드들의 SQL 구문 모음
    const updates: string[] = [];
    // 실제 값 모음
    const values: any[] = [];

    // 변경된 필드만 업데이트 할 수 있도록 처리
    if (boardParams.BOARDTITLE !== undefined) {
      updates.push('BOARDTITLE = ?');
      values.push(boardParams.BOARDTITLE);
    }

    if (boardParams.BOARDCONTENT !== undefined) {
      updates.push('BOARDCONTENT = ?');
      values.push(boardParams.BOARDCONTENT);
    }

    if (boardParams.MEMBERNAME !== undefined) {
      updates.push('MEMBERNAME = ?');
      values.push(boardParams.MEMBERNAME);
    }

    // 수정할 내용 없으면 조회하고 반환
    if (updates.length === 0) {
      return this.getById(id);
    }

    // id를 values 배열에 추가
    values.push(id);

    await db.query(
      `UPDATE board SET ${updates.join(', ')} WHERE BID = ?`,
      values
    );

    // 수정 후 게시글 정보를 다시 조회하고 반환
    return this.getById(id);
  }

  // 게시글 삭제
  public async delete(id: number): Promise<void> {
    const result = await db.query('DELETE FROM board WHERE BID = ?', [id]);
    // 삭제된 행의 수 확인
    if (result.affectedRows === 0) {
      // 예외처리
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
  }
}
