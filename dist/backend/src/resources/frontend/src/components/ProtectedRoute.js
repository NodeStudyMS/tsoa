"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = (0, AuthContext_1.useAuth)();
    if (loading) {
        return <div className="loading">로딩 중...</div>;
    }
    if (!isAuthenticated) {
        return <react_router_dom_1.Navigate to="/login"/>;
    }
    return <>{children}</>;
};
exports.default = ProtectedRoute;
