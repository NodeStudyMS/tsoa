import db from '../db/db';
import { Board, BoardCreationParams, BoardUpdateParams } from '../models/Board';

export class BoardService {
  public async getAll(): Promise<Board[]> {
    return await db.query('SELECT * FROM board ORDER BY BID DESC');
  }

  public async getById(id: number): Promise<Board> {
    const result = await db.query('SELECT * FROM board WHERE BID = ?', [id]);
    if (result.length === 0) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
    return result[0];
  }

  public async create(boardParams: BoardCreationParams): Promise<Board> {
    const result = await db.query(
      'INSERT INTO board (BOARDTITLE, BOARDCONTENT, MEMBERNAME) VALUES (?, ?, ?)',
      [boardParams.BOARDTITLE, boardParams.BOARDCONTENT, boardParams.MEMBERNAME]
    );
    
    return this.getById(result.insertId);
  }

  public async update(id: number, boardParams: BoardUpdateParams): Promise<Board> {
    const updates: string[] = [];
    const values: any[] = [];

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

    if (updates.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    await db.query(
      `UPDATE board SET ${updates.join(', ')} WHERE BID = ?`,
      values
    );

    return this.getById(id);
  }

  public async delete(id: number): Promise<void> {
    const result = await db.query('DELETE FROM board WHERE BID = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
    }
  }
}
