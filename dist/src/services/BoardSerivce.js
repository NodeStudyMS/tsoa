"use strict";
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
const db_1 = __importDefault(require("../db/db"));
class BoardService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.query('SELECT * FROM board ORDER BY BID DESC');
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('SELECT * FROM board WHERE BID = ?', [id]);
            if (result.length === 0) {
                throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
            }
            return result[0];
        });
    }
    create(boardParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('INSERT INTO board (BOARDTITLE, BOARDCONTENT, MEMBERNAME) VALUES (?, ?, ?)', [boardParams.BOARDTITLE, boardParams.BOARDCONTENT, boardParams.MEMBERNAME]);
            return this.getById(result.insertId);
        });
    }
    update(id, boardParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = [];
            const values = [];
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
            yield db_1.default.query(`UPDATE board SET ${updates.join(', ')} WHERE BID = ?`, values);
            return this.getById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('DELETE FROM board WHERE BID = ?', [id]);
            if (result.affectedRows === 0) {
                throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
            }
        });
    }
}
exports.BoardService = BoardService;
