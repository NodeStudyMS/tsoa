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
exports.useAuth = exports.AuthProvider = void 0;
const react_1 = __importStar(require("react"));
const api_1 = __importDefault(require("../services/api"));
// 인증 정보를 저장하고 공유하기 위한 Context 생성
const AuthContext = (0, react_1.createContext)(undefined);
// JWT 토큰 디코딩 함수 (프론트엔드용)
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
    catch (e) {
        console.error("토큰 디코딩 실패:", e);
        return null;
    }
}
// 인증 상태를 관리하고 자식 컴포넌트에 제공하는 Provider 컴포넌트
const AuthProvider = ({ children }) => {
    // 사용자 정보 상태
    const [user, setUser] = (0, react_1.useState)(null);
    // JWT 토큰 상태
    const [token, setToken] = (0, react_1.useState)(null);
    // 로딩 상태 (API 요청 중인지 여부)
    const [loading, setLoading] = (0, react_1.useState)(true);
    // 인증 완료 여부 상태
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 불러와 인증 상태 초기화
    (0, react_1.useEffect)(() => {
        const initAuth = () => __awaiter(void 0, void 0, void 0, function* () {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // API 요청에 토큰 설정
                    api_1.default.setAuthToken(storedToken);
                    setToken(storedToken);
                    // 토큰으로 사용자 정보 조회
                    const userData = yield api_1.default.getMyProfile();
                    setUser(userData);
                    setIsAuthenticated(true);
                }
                catch (error) {
                    // 토큰이 유효하지 않은 경우 로컬 스토리지에서 제거
                    console.error('인증 초기화 실패:', error);
                    localStorage.removeItem('token');
                }
            }
            // 초기화 완료 후 로딩 상태 해제
            setLoading(false);
        });
        initAuth();
    }, []);
    // 로그인 함수: 아이디와 비밀번호로 로그인 처리
    const login = (mid, mpw) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            // 로그인 API 호출하여 토큰 받기
            const token = yield api_1.default.login(mid, mpw);
            localStorage.setItem('token', token);
            setToken(token);
            // 받은 토큰으로 사용자 정보 조회
            const userData = yield api_1.default.getMyProfile();
            setUser(userData);
            setIsAuthenticated(true);
            // 토큰에서 역할 정보 추출
            const decoded = decodeJWT(token);
            const role = (decoded === null || decoded === void 0 ? void 0 : decoded.MROLE) || 'unknown';
            return role; // 사용자 역할 반환
        }
        catch (error) {
            console.error('로그인 실패:', error);
            throw error; // 에러를 상위로 전파하여 UI에서 처리할 수 있게 함
        }
        finally {
            setLoading(false);
        }
    });
    // 회원가입 함수: 아이디, 비밀번호, 이름으로 회원가입 처리
    const register = (mid, mpw, membername) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        try {
            // 회원가입 API 호출하여 토큰 받기
            const token = yield api_1.default.register(mid, mpw, membername);
            localStorage.setItem('token', token);
            setToken(token);
            // 받은 토큰으로 사용자 정보 조회
            const userData = yield api_1.default.getMyProfile();
            setUser(userData);
            setIsAuthenticated(true);
        }
        catch (error) {
            console.error('회원가입 실패:', error);
            throw error; // 에러를 상위로 전파
        }
        finally {
            setLoading(false);
        }
    });
    // 로그아웃 함수: 토큰 및 사용자 정보 초기화
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        api_1.default.setAuthToken(null);
    };
    // Context Provider를 통해 인증 관련 상태와 함수들을 자식 컴포넌트에 제공
    return (<AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
// 인증 컨텍스트를 쉽게 사용할 수 있는 커스텀 훅
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth는 AuthProvider 내에서 사용해야 합니다');
    }
    return context;
};
exports.useAuth = useAuth;
