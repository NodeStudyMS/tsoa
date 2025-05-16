"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// frontend/src/App.tsx
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("./contexts/AuthContext");
const Login_1 = __importDefault(require("./components/Login"));
const Register_1 = __importDefault(require("./components/Register"));
const Chat_1 = __importDefault(require("./components/Chat"));
const ProtectedRoute_1 = __importDefault(require("./components/ProtectedRoute"));
require("./styles/App.css");
const App = () => {
    return (<AuthContext_1.AuthProvider>
        <div className="app">
          <react_router_dom_1.Routes>
            <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
            <react_router_dom_1.Route path="/register" element={<Register_1.default />}/>
            <react_router_dom_1.Route path="/chat" element={<ProtectedRoute_1.default>
                  <Chat_1.default />
                </ProtectedRoute_1.default>}/>
            <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/chat"/>}/>
          </react_router_dom_1.Routes>
        </div>
    </AuthContext_1.AuthProvider>);
};
exports.default = App;
