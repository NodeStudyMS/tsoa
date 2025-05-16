"use strict";
// backend/src/controllers/ChatController.ts
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
exports.ChatController = void 0;
const tsoa_1 = require("tsoa");
const ChatService_1 = require("../services/ChatService");
const express = __importStar(require("express"));
let ChatController = class ChatController extends tsoa_1.Controller {
    constructor() {
        super(...arguments);
        this.service = new ChatService_1.ChatService();
    }
    // 채팅방 목록을 전부 가져오는 API
    // JWT 토큰으로 인증된 사용자만 접근 가능
    getChatRooms(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getAllRooms();
        });
    }
    // 특정 ID의 채팅방 정보를 조회하는 API
    // 채팅방 ID를 경로 파라미터로 받음
    // JWT 토큰으로 인증된 사용자만 접근 가능
    getChatRoom(roomId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getRoomById(roomId);
        });
    }
    // 특정 채팅방의 메시지 내역을 조회하는 API
    // 채팅방 ID를 경로 파라미터로 받아서 해당 방의 메시지만 가져옴
    // JWT 토큰으로 인증된 사용자만 접근 가능
    getChatMessages(roomId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getMessagesByRoomId(roomId);
        });
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, tsoa_1.Get)("rooms"),
    (0, tsoa_1.Security)("jwt"),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRooms", null);
__decorate([
    (0, tsoa_1.Get)("rooms/{roomId}"),
    (0, tsoa_1.Security)("jwt"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatRoom", null);
__decorate([
    (0, tsoa_1.Get)("rooms/{roomId}/messages"),
    (0, tsoa_1.Security)("jwt"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getChatMessages", null);
exports.ChatController = ChatController = __decorate([
    (0, tsoa_1.Route)("chat"),
    (0, tsoa_1.Tags)("Chat")
], ChatController);
