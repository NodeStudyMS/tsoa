"use strict";
// backend/src/controllers/BoardControllers.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.BoardController = void 0;
// tsoa 라이브러리에서 필요한 데코레이터 import
const tsoa_1 = require("tsoa");
// BoardSerivce를 import 하고 실제 비즈니스 로직 처리
const BoardSerivce_1 = require("../services/BoardSerivce");
// C의 기본경로를 /api/boards로 설정
let BoardController = class BoardController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.service = new BoardSerivce_1.BoardService();
    }
    // 모든 게시글 조회 (GET 요청)
    getBoards() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getAll();
        });
    }
    // 특정 게시글 조회 (GET 요청)
    getBoard(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getById(boardId);
        });
    }
    // 게시글 생성 (POST 요청)
    createBoard(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            // 새로 생성된 게시글 정보를 반환함
            return this.service.create(requestBody);
        });
    }
    // 게시글 수정 (PUT 요청)
    updateBoard(boardId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            // 수정된 게시글 정보 반환
            return this.service.update(boardId, requestBody);
        });
    }
    // 게시글 삭제 (DELETE 요청)
    deleteBoard(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.delete(boardId);
        });
    }
};
exports.BoardController = BoardController;
__decorate([
    (0, tsoa_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getBoards", null);
__decorate([
    (0, tsoa_1.Get)("{boardId}")
    // URL 경로에서 boardID 추출 후 게시글 하나 반환
    ,
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getBoard", null);
__decorate([
    (0, tsoa_1.Post)()
    // @Body()는 요청 본문에서 게시글 생성에 필요한 데이터를 가져옴
    ,
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "createBoard", null);
__decorate([
    (0, tsoa_1.Put)("{boardId}"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "updateBoard", null);
__decorate([
    (0, tsoa_1.Delete)("{boardId}") // /api/board/1, /api/board/2
    ,
    (0, tsoa_1.Response)("204", "No Content") // 삭제 성공 시 204 반환
    ,
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "deleteBoard", null);
exports.BoardController = BoardController = __decorate([
    (0, tsoa_1.Route)("api/boards")
    // Swagger 문서에서 Board 태그로 그룹화
    ,
    (0, tsoa_1.Tags)("Board")
], BoardController);
