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
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseAny = void 0;
exports.expressAuthentication = expressAuthentication;
const jwt = __importStar(require("jsonwebtoken"));
// JWT 시크릿 키 (실제로는 환경변수에서 가져오는 것이 좋습니다)
const JWT_SECRET = 'your-secret-key';
function expressAuthentication(request, securityName, scopes) {
    var _a;
    if (securityName === 'jwt') {
        const token = (_a = request.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error('인증 토큰이 없습니다'));
                return;
            }
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                }
                else {
                    // 스코프(권한) 체크가 필요한 경우
                    if (scopes && scopes.length > 0) {
                        const userRole = decoded.role;
                        if (!scopes.includes(userRole)) {
                            reject(new Error('권한이 없습니다'));
                            return;
                        }
                    }
                    // 인증된 사용자 정보를 request에 저장
                    request.user = decoded;
                    resolve(decoded);
                }
            });
        });
    }
    return Promise.reject(new Error('유효하지 않은 인증 방식입니다'));
}
// Promise.any 폴리필 (Node.js 버전이 낮은 경우 필요)
const promiseAny = (promises) => {
    return new Promise((resolve, reject) => {
        let errors = [];
        let pending = promises.length;
        if (pending === 0) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }
        promises.forEach(promise => {
            promise.then(result => resolve(result), error => {
                errors.push(error);
                if (--pending === 0) {
                    reject(new AggregateError(errors, 'All promises were rejected'));
                }
            });
        });
    });
};
exports.promiseAny = promiseAny;
// AggregateError 폴리필
class AggregateError extends Error {
    constructor(errors, message) {
        super(message);
        this.name = 'AggregateError';
        this.errors = errors;
    }
}
