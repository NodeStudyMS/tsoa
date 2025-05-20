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
exports.app = void 0;
exports.initServer = initServer;
// backend/src/app.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("./routes/routes");
const sequelize_1 = require("./db/sequelize");
const ChatService_1 = require("./services/ChatService");
const path_1 = __importDefault(require("path"));
exports.app = (0, express_1.default)();
// CORS 설정 - 프론트엔드(80번 포트)에서의 요청 허용
// 다양한 환경에서 접근 가능하도록 설정
exports.app.use((0, cors_1.default)({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
exports.app.use(body_parser_1.default.json());
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
// 정적 파일 제공 - API 문서용
exports.app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Swagger UI 설정
exports.app.use("/docs", swagger_ui_express_1.default.serve, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(swagger_ui_express_1.default.generateHTML(yield Promise.resolve().then(() => __importStar(require("../public/swagger.json")))));
}));
// tsoa 라우트 등록
(0, routes_1.RegisterRoutes)(exports.app);
// 에러 핸들링
exports.app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    console.error(`API 오류 (${status}): ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }
    res.status(status).json({
        message,
        status,
    });
});
// 서버 초기화 함수 (server.ts에서 호출)
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 데이터베이스 초기화
            yield (0, sequelize_1.initDatabase)();
            // 기본 채팅방 초기화
            const chatService = new ChatService_1.ChatService();
            yield chatService.initializeDefaultRooms();
            console.log("서버 초기화 완료");
        }
        catch (error) {
            console.error("서버 초기화 실패:", error);
            throw error;
        }
    });
}
// 직접 실행될 때만 초기화 (개발 중 테스트용)
if (require.main === module) {
    console.warn("경고: app.ts를 직접 실행하지 마세요. server.ts를 통해 실행하세요.");
    initServer().catch((err) => {
        console.error("초기화 실패:", err);
        process.exit(1);
    });
}
