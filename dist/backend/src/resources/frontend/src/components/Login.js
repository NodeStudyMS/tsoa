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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
require("../styles/Auth.css");
const Login = () => {
    const [mid, setMid] = (0, react_1.useState)('');
    const [mpw, setMpw] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const { login, loading } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        e.preventDefault();
        setError('');
        try {
            // 로그인 시 사용자 역할 받아오기
            const role = yield login(mid, mpw);
            // 역할에 따라 다른 알림 표시
            if (role === 'admin') {
                alert('관리자로 로그인하셨습니다.');
            }
            else if (role === 'user') {
                alert('일반 사용자로 로그인하셨습니다.');
            }
            else {
                // 역할이 명확하지 않은 경우
                alert(`${role} 권한으로 로그인하셨습니다.`);
            }
            navigate('/chat');
        }
        catch (err) {
            setError(((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || '로그인에 실패했습니다');
        }
    });
    return (<div className="auth-container">
      <div className="auth-card">
        <h2>로그인 🔐</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mid">아이디</label>
            <input id="mid" type="text" value={mid} onChange={(e) => setMid(e.target.value)} required disabled={loading}/>
          </div>
          
          <div className="form-group">
            <label htmlFor="mpw">비밀번호</label>
            <input id="mpw" type="password" value={mpw} onChange={(e) => setMpw(e.target.value)} required disabled={loading}/>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <p className="auth-link">
          계정이 없으신가요? <react_router_dom_1.Link to="/register">회원가입</react_router_dom_1.Link>
        </p>
      </div>
    </div>);
};
exports.default = Login;
