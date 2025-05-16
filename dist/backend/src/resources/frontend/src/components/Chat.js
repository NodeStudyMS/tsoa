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
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AuthContext_1 = require("../contexts/AuthContext");
const socket_1 = require("../services/socket");
const api_1 = __importDefault(require("../services/api"));
require("../styles/Chat.css");
const Chat = () => {
    var _a;
    const { user, token, logout } = (0, AuthContext_1.useAuth)();
    const [message, setMessage] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [rooms, setRooms] = (0, react_1.useState)([]);
    const [currentRoom, setCurrentRoom] = (0, react_1.useState)('general');
    const [systemMessages, setSystemMessages] = (0, react_1.useState)([]);
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    const messagesEndRef = (0, react_1.useRef)(null);
    const navigate = (0, react_router_dom_1.useNavigate)();
    // 채팅방 목록 로드
    (0, react_1.useEffect)(() => {
        const loadRooms = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const roomsData = yield api_1.default.getChatRooms();
                setRooms(roomsData);
            }
            catch (error) {
                console.error('채팅방 목록 로드 실패:', error);
            }
        });
        loadRooms();
    }, []);
    // 소켓 연결 및 이벤트 리스너 설정
    (0, react_1.useEffect)(() => {
        if (!token || !user) {
            navigate('/login');
            return;
        }
        // 소켓 연결
        const socket = socket_1.socketService.connect(token);
        setIsConnected(true);
        // 현재 채팅방 메시지 로드
        const loadMessages = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const messagesData = yield api_1.default.getChatMessages(currentRoom);
                setMessages(messagesData.reverse()); // 최신 메시지가 아래에 오도록 정렬
            }
            catch (error) {
                console.error('메시지 로드 실패:', error);
            }
        });
        loadMessages();
        // 기본 채팅방 참여
        socket_1.socketService.joinRoom(currentRoom);
        // 메시지 수신 리스너
        const unsubscribeMessage = socket_1.socketService.onReceiveMessage((newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        // 사용자 참여 리스너
        const unsubscribeUserJoined = socket_1.socketService.onUserJoined((data) => {
            setSystemMessages((prev) => [...prev, data.message]);
        });
        // 사용자 퇴장 리스너
        const unsubscribeUserLeft = socket_1.socketService.onUserLeft((data) => {
            setSystemMessages((prev) => [...prev, data.message]);
        });
        // 에러 리스너
        const unsubscribeError = socket_1.socketService.onError((error) => {
            console.error('소켓 에러:', error.message);
            setSystemMessages((prev) => [...prev, `오류: ${error.message}`]);
        });
        return () => {
            unsubscribeMessage();
            unsubscribeUserJoined();
            unsubscribeUserLeft();
            unsubscribeError();
            socket_1.socketService.leaveRoom(currentRoom);
            socket_1.socketService.disconnect();
            setIsConnected(false);
        };
    }, [token, user, navigate, currentRoom]);
    // 메시지 목록 자동 스크롤
    (0, react_1.useEffect)(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !isConnected)
            return;
        socket_1.socketService.sendMessage(message, currentRoom);
        setMessage('');
    };
    const handleRoomChange = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
        socket_1.socketService.leaveRoom(currentRoom);
        setCurrentRoom(roomId);
        socket_1.socketService.joinRoom(roomId);
        setMessages([]);
        setSystemMessages([]);
        try {
            const messagesData = yield api_1.default.getChatMessages(roomId);
            setMessages(messagesData.reverse());
        }
        catch (error) {
            console.error('메시지 로드 실패:', error);
        }
    });
    const handleLogout = () => {
        socket_1.socketService.disconnect();
        logout();
        navigate('/login');
    };
    // 메시지 시간 포맷팅
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    return (<div className="chat-container">
      <div className="chat-header">
        <h2>채팅방: {((_a = rooms.find(r => r.id === currentRoom)) === null || _a === void 0 ? void 0 : _a.name) || currentRoom} 💬</h2>
        <div className="user-info">
          <span>{(user === null || user === void 0 ? void 0 : user.MEMBERNAME) || (user === null || user === void 0 ? void 0 : user.MID)} 님</span>
          <button onClick={handleLogout} className="logout-btn">로그아웃</button>
        </div>
      </div>
      
      <div className="chat-main">
        <div className="chat-sidebar">
          <h3>채팅방 목록</h3>
          <ul className="room-list">
            {rooms.map((room) => (<li key={room.id} className={currentRoom === room.id ? 'active' : ''} onClick={() => handleRoomChange(room.id)}>
                <span className="room-name">{room.name}</span>
                <span className="room-description">{room.description}</span>
              </li>))}
          </ul>
        </div>
        
        <div className="chat-content">
          <div className="chat-messages">
            {messages.map((msg, index) => (<div key={index} className={`message ${msg.senderId === (user === null || user === void 0 ? void 0 : user.MID) ? 'own-message' : ''}`}>
                <div className="message-header">
                  <span className="sender">{msg.senderName || msg.senderId}</span>
                  <span className="timestamp">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">{msg.content}</div>
              </div>))}
            
            {systemMessages.map((msg, index) => (<div key={`system-${index}`} className="system-message">
                {msg}
              </div>))}
            
            <div ref={messagesEndRef}/>
          </div>
          
          <form onSubmit={handleSendMessage} className="message-form">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="메시지를 입력하세요..." disabled={!isConnected}/>
            <button type="submit" disabled={!isConnected}>전송</button>
          </form>
        </div>
      </div>
    </div>);
};
exports.default = Chat;
