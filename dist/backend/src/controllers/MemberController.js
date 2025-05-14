"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const jwt_1 = require("../utils/jwt");
const express = __importStar(require("express"));
// API 경로를 /members로 지정
let MemberController = class MemberController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        // MemberService 인스턴스 생성
        this.service = new MemberService_1.MemberService();
    }
    // 모든 회원 목록 조회
    getMembers(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield this.service.getAll();
            return members.map(member => ({
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME,
                MROLE: member.MROLE
            }));
        });
    }
    // 특정 회원 한 명의 정보만 조회
    getMember(mid, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.service.getById(mid);
            return {
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME,
                MROLE: member.MROLE
            };
        });
    }
    // 회원가입 처리
    registerMember(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            // 기본 역할 설정 (지정되지 않은 경우)
            if (!requestBody.MROLE) {
                requestBody.MROLE = 'user';
            }
            const member = yield this.service.register(requestBody);
            // JWT 토큰 생성 (사용자 정보를 토큰 내부에 담음)
            const token = (0, jwt_1.generateToken)({
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME,
                MROLE: member.MROLE
            });
            this.setStatus(201); // Created
            return token;
        });
    }
    // 로그인
    loginMember(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            // 로그인 정보(아이디, 비밀번호)를 받아서 서비스에 전달
            const member = yield this.service.login(requestBody);
            // JWT 토큰 생성 (사용자 정보를 토큰 내부에 담음)
            const token = (0, jwt_1.generateToken)({
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME,
                MROLE: member.MROLE
            });
            return token;
        });
    }
    // 회원정보 수정
    updateMember(mid, requestBody, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.service.update(mid, requestBody);
            return {
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME,
                MROLE: member.MROLE
            };
        });
    }
    // 회원 삭제
    deleteMember(mid, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.service.delete(mid);
        });
    }
    // 현재 로그인한 사용자 정보 조회
    getMyProfile(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.user) {
                throw new Error('인증되지 않은 사용자입니다');
            }
            const userId = request.user.MID;
            const member = yield this.service.getById(userId);
            return {
                MID: member.MID,
                MEMBERNAME: member.MEMBERNAME,
                MROLE: member.MROLE
            };
        });
    }
};
exports.MemberController = MemberController;
__decorate([
    (0, tsoa_1.Get)(),
    (0, tsoa_1.Security)('jwt'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getMembers", null);
__decorate([
    (0, tsoa_1.Get)('{mid}'),
    (0, tsoa_1.Security)('jwt'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getMember", null);
__decorate([
    (0, tsoa_1.Post)('register'),
    (0, tsoa_1.Response)(201, '회원가입 성공'),
    (0, tsoa_1.Response)(409, '이미 존재하는 사용자'),
    (0, tsoa_1.Example)("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "registerMember", null);
__decorate([
    (0, tsoa_1.Post)('login'),
    (0, tsoa_1.Response)(200, '로그인 성공'),
    (0, tsoa_1.Response)(401, '인증 실패'),
    (0, tsoa_1.Example)("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "loginMember", null);
__decorate([
    (0, tsoa_1.Put)('{mid}'),
    (0, tsoa_1.Security)('jwt'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "updateMember", null);
__decorate([
    (0, tsoa_1.Delete)('{mid}'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Response)('204', 'No Content'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "deleteMember", null);
__decorate([
    (0, tsoa_1.Get)('me/profile'),
    (0, tsoa_1.Security)('jwt'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemberController.prototype, "getMyProfile", null);
exports.MemberController = MemberController = __decorate([
    (0, tsoa_1.Route)('members')
    // Swagger 문서에서 'Member' 태그로 이 컨트롤러의 API들을 묶기
    ,
    (0, tsoa_1.Tags)('Member')
], MemberController);
