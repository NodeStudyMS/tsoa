"use strict";
// src/services/BoardService.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardService = void 0;
const Board_1 = require("../models/Board");
class BoardService {
    // 모든 게시글 조회 (최신순)
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const boards = yield Board_1.BoardModel.findAll({
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
        });
    }
    // 특정 게시글 조회
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield Board_1.BoardModel.findByPk(id);
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
        });
    }
    // 게시글 생성
    create(boardParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBoard = yield Board_1.BoardModel.create({
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
        });
    }
    // 게시글 수정
    update(id, boardParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = yield Board_1.BoardModel.findByPk(id);
            if (!board) {
                throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
            }
            const updateData = {};
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
            yield board.update(updateData);
            return {
                BID: board.BID,
                BOARDTITLE: board.BOARDTITLE,
                BOARDCONTENT: board.BOARDCONTENT,
                BOARDREGDATE: board.BOARDREGDATE.toISOString(),
                MEMBERNAME: board.MEMBERNAME
            };
        });
    }
    // 게시글 삭제
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield Board_1.BoardModel.destroy({
                where: { BID: id }
            });
            if (result === 0) {
                throw new Error(`게시글 ID ${id}를 찾을 수 없습니다`);
            }
        });
    }
}
exports.BoardService = BoardService;
