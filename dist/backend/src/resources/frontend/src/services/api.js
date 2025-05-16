"use strict";
// frontend/src/services
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
exports.getChatMessages = exports.getChatRooms = exports.getMyProfile = exports.register = exports.login = void 0;
const axios_1 = __importDefault(require("axios"));
const API_URL = "http://localhost:3000";
// 인증 토큰을 헤더에 추가하는 함수
const setAuthToken = (token) => {
    if (token) {
        axios_1.default.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else {
        delete axios_1.default.defaults.headers.common["Authorization"];
    }
};
// 로그인 API
const login = (mid, mpw) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`${API_URL}/members/login`, {
        MID: mid,
        MPW: mpw,
    });
    const token = response.data;
    setAuthToken(token);
    return token;
});
exports.login = login;
// 회원가입 API
const register = (mid, mpw, membername) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.post(`${API_URL}/members/register`, {
        MID: mid,
        MPW: mpw,
        MEMBERNAME: membername,
    });
    const token = response.data;
    setAuthToken(token);
    return token;
});
exports.register = register;
// 내 프로필 조회 API
const getMyProfile = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${API_URL}/members/me/profile`);
    return response.data;
});
exports.getMyProfile = getMyProfile;
// 채팅방 목록 조회 API
const getChatRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${API_URL}/chat/rooms`);
    return response.data;
});
exports.getChatRooms = getChatRooms;
// 특정 채팅방 메시지 조회 API
const getChatMessages = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get(`${API_URL}/chat/rooms/${roomId}/messages`);
    return response.data;
});
exports.getChatMessages = getChatMessages;
exports.default = {
    login: exports.login,
    register: exports.register,
    getMyProfile: exports.getMyProfile,
    getChatRooms: exports.getChatRooms,
    getChatMessages: exports.getChatMessages,
    setAuthToken,
};
