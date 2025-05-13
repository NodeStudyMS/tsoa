"use strict";
// src/controllers/MemberController.ts
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
exports.MemberController = void 0;
const tsoa_1 = require("tsoa");
const MemberService_1 = require("../services/MemberService");
let MemberController = class MemberController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.service = new MemberService_1.MemberService();
    }
    // 모든 회원 조회
    getMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getAll();
        });
    }
    // 특정 회원 조회
    getMember(mid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.getById(mid);
        });
    }
    // 회원가입
    registerMember(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.register(requestBody);
        });
    }
    // 로그인
    loginMember(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.login(requestBody);
        });
    }
    // 회원정보 수정
    updateMember(mid, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.update(mid, requestBody);
        });
    }
    // 회원 삭제
    deleteMember(mid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.delete(mid);
        });
    }
};
exports.MemberController = MemberController;
__decorate([
    (0, tsoa_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getMembers", null);
__decorate([
    (0, tsoa_1.Get)('{mid}'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getMember", null);
__decorate([
    (0, tsoa_1.Post)('register'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "registerMember", null);
__decorate([
    (0, tsoa_1.Post)('login'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "loginMember", null);
__decorate([
    (0, tsoa_1.Put)('{mid}'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "updateMember", null);
__decorate([
    (0, tsoa_1.Delete)('{mid}'),
    (0, tsoa_1.Response)('204', 'No Content'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "deleteMember", null);
exports.MemberController = MemberController = __decorate([
    (0, tsoa_1.Route)('members'),
    (0, tsoa_1.Tags)('Member')
], MemberController);
