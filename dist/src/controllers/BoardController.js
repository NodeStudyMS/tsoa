"use strict";
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
const tsoa_1 = require("tsoa");
const BoardSerivce_1 = require("../services/BoardSerivce");
let BoardController = class BoardController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.service = new BoardSerivce_1.BoardService();
    }
    getBoards() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getAll();
        });
    }
    getBoard(boardId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getById(boardId);
        });
    }
    createBoard(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.create(requestBody);
        });
    }
    updateBoard(boardId, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.update(boardId, requestBody);
        });
    }
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
    (0, tsoa_1.Get)('{boardId}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "getBoard", null);
__decorate([
    (0, tsoa_1.Post)(),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "createBoard", null);
__decorate([
    (0, tsoa_1.Put)('{boardId}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "updateBoard", null);
__decorate([
    (0, tsoa_1.Delete)('{boardId}'),
    (0, tsoa_1.Response)('204', 'No Content'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BoardController.prototype, "deleteBoard", null);
exports.BoardController = BoardController = __decorate([
    (0, tsoa_1.Route)('boards'),
    (0, tsoa_1.Tags)('Board')
], BoardController);
