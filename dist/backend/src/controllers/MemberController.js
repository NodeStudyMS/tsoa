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
exports.MemberController = void 0;
const tsoa_1 = require("tsoa");
const MemberService_1 = require("../services/MemberService");
// API 경로를 /members로 지정
let MemberController = class MemberController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        // MemberService 인스턴스 생성
        this.service = new MemberService_1.MemberService();
    }
    // 모든 회원 목록 조회
    // SELECT * FROM MEMBER;
    getMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            // 모든 회원 정보를 가져옴
            const members = yield this.service.getAll();
            // ID와 이름만 반환하도록 매핑함
            return members.map(member => ({
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME
            }));
        });
    }
    // 특정 회원 한 명의 정보만 조회
    // SELECT * FROM MEMBER WHERE MID = ?
    getMember(mid) {
        return __awaiter(this, void 0, void 0, function* () {
            // Path 데코레이터로 URL에서 회원 ID를 받아옴
            const member = yield this.service.getById(mid);
            return {
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME
            };
        });
    }
    // 회원가입 처리
    // INSERT INTO MEMBER (MID, MEMBERNAME, ...) VALUES (?, ?, ...)
    registerMember(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.service.register(requestBody);
            // 가입 성공 후 기본 정보만 반환
            return {
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME
            };
        });
    }
    // 로그인
    // 아이디와 비밀번호 확인 후 인증된 회원 정보 반환
    loginMember(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            // 로그인 정보(아이디, 비밀번호)를 받아서 서비스에 전달
            const member = yield this.service.login(requestBody);
            return {
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME
            };
        });
    }
    // 회원정보 수정
    // UPDATE MEMBER SET ... WHERE MID = ?
    updateMember(mid, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            // 서비스에 ID와 수정할 정보를 전달
            const member = yield this.service.update(mid, requestBody);
            return {
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME
            };
        });
    }
    // 회원 삭제
    // DELETE FROM MEMBER WHERE MID = ?
    deleteMember(mid) {
        return __awaiter(this, void 0, void 0, function* () {
            // 서비스에 삭제할 회원 ID 전달
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
    (0, tsoa_1.Response)('204', 'No Content') // 삭제 성공 시 204 반환
    ,
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "deleteMember", null);
exports.MemberController = MemberController = __decorate([
    (0, tsoa_1.Route)('members')
    // Swagger 문서에서 'Member' 태그로 이 컨트롤러의 API들을 묶기
    ,
    (0, tsoa_1.Tags)('Member')
], MemberController);
