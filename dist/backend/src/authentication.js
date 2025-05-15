"use strict";
// backend/src/authentication.ts - 사용자 인증을 처리
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseAny = void 0;
exports.expressAuthentication = expressAuthentication;
const jwt = __importStar(require("jsonwebtoken"));
// JWT 토큰 생성/검증에 사용할 비밀키
const JWT_SECRET = 'your-secret-key';
function expressAuthentication(request, securityName, scopes) {
    var _a;
    // JWT 인증 방식인 경우
    if (securityName === 'jwt') {
        // Authorization 헤더에서 Bearer 토큰 추출
        const token = (_a = request.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        return new Promise((resolve, reject) => {
            // 토큰이 없는 경우 인증 실패
            if (!token) {
                reject(new Error('인증 토큰이 없습니다'));
                return;
            }
            // JWT 토큰 검증
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    // 토큰이 유효하지 않은 경우 (만료, 서명 불일치 등)
                    reject(err);
                }
                else {
                    // 권한(스코프) 확인이 필요한 경우
                    if (scopes && scopes.length > 0) {
                        const userRole = decoded.role;
                        // 사용자의 역할이 요구되는 스코프에 포함되지 않으면 접근 거부
                        if (!scopes.includes(userRole)) {
                            reject(new Error('권한이 없습니다'));
                            return;
                        }
                    }
                    // 인증된 사용자 정보를 request 객체에 저장 (컨트롤러에서 접근 가능)
                    request.user = decoded;
                    resolve(decoded);
                }
            });
        });
    }
    // JWT 이외의 인증 방식은 지원하지 않음
    return Promise.reject(new Error('유효하지 않은 인증 방식입니다'));
}
const promiseAny = (promises) => {
    return new Promise((resolve, reject) => {
        let errors = [];
        let pending = promises.length;
        // 빈 배열이 전달된 경우 즉시 에러 반환
        if (pending === 0) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }
        // 모든 Promise를 순회하며 처리
        promises.forEach(promise => {
            promise.then(
            // 하나라도 성공하면 즉시 그 결과 반환
            result => resolve(result), 
            // 실패하면 에러를 모으고, 모두 실패한 경우에만 에러 반환
            error => {
                errors.push(error);
                if (--pending === 0) {
                    reject(new AggregateError(errors, 'All promises were rejected'));
                }
            });
        });
    });
};
exports.promiseAny = promiseAny;
class AggregateError extends Error {
    constructor(errors, message) {
        super(message);
        this.name = 'AggregateError';
        this.errors = errors;
    }
}
