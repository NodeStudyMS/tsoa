"use strict";
// src/services/BoardSerivce.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardService = void 0;
// db 연결 메서드 import
const db_1 = __importDefault(require("../db/db"));
class BoardService {
    // 게시글 ID 기준 내림차순 정렬(최신순)
    // 배열반환
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.query('SELECT * FROM board ORDER BY BID DESC');
        });
    }
    // 특정 게시글 조회
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // ?와 [id] : SQL 인젝션 공격 방지를 위한 파라미터 바인딩
            const result = yield db_1.default.query('SELECT * FROM board WHERE BID = ?', [id]);
            // 예외처리
            if (result.length === 0) {
                throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
            }
            return result[0];
        });
    }
    // 게시글 추가
    create(boardParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('INSERT INTO board (BOARDTITLE, BOARDCONTENT, MEMBERNAME) VALUES (?, ?, ?)', [boardParams.BOARDTITLE, boardParams.BOARDCONTENT, boardParams.MEMBERNAME]);
            // 생성된 게시글 전체 정보를 조회하고 반환
            return this.getById(result.insertId);
        });
    }
    // 게시글 수정
    update(id, boardParams) {
        return __awaiter(this, void 0, void 0, function* () {
            // 수정할 필드들의 SQL 구문 모음
            const updates = [];
            // 실제 값 모음
            const values = [];
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
            yield db_1.default.query(`UPDATE board SET ${updates.join(', ')} WHERE BID = ?`, values);
            // 수정 후 게시글 정보를 다시 조회하고 반환
            return this.getById(id);
        });
    }
    // 게시글 삭제
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('DELETE FROM board WHERE BID = ?', [id]);
            // 삭제된 행의 수 확인
            if (result.affectedRows === 0) {
                // 예외처리
                throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
            }
        });
    }
}
exports.BoardService = BoardService;
