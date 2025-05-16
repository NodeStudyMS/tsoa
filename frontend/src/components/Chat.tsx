import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { socketService } from '../services/socket';
import { ChatMessage, ChatRoom } from '../types';
import api from '../services/api';
import '../styles/Chat.css';

const Chat: React.FC = () => {
  const { user, token, logout } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [systemMessages, setSystemMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 채팅방 목록 로드
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const roomsData = await api.getChatRooms();
        setRooms(roomsData);
      } catch (error) {
        console.error('채팅방 목록 로드 실패:', error);
      }
    };
    
    loadRooms();
  }, []);

  // 소켓 연결 및 이벤트 리스너 설정
  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    // 소켓 연결
    const socket = socketService.connect(token);
    setIsConnected(true);

    // 현재 채팅방 메시지 로드
    const loadMessages = async () => {
      try {
        const messagesData = await api.getChatMessages(currentRoom);
        setMessages(messagesData.reverse()); // 최신 메시지가 아래에 오도록 정렬
      } catch (error) {
        console.error('메시지 로드 실패:', error);
      }
    };
    
    loadMessages();

    // 기본 채팅방 참여
    socketService.joinRoom(currentRoom);

    // 메시지 수신 리스너
    const unsubscribeMessage = socketService.onReceiveMessage((newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // 사용자 참여 리스너
    const unsubscribeUserJoined = socketService.onUserJoined((data) => {
      setSystemMessages((prev) => [...prev, data.message]);
    });

    // 사용자 퇴장 리스너
    const unsubscribeUserLeft = socketService.onUserLeft((data) => {
      setSystemMessages((prev) => [...prev, data.message]);
    });

    // 에러 리스너
    const unsubscribeError = socketService.onError((error) => {
      console.error('소켓 에러:', error.message);
      setSystemMessages((prev) => [...prev, `오류: ${error.message}`]);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeUserJoined();
      unsubscribeUserLeft();
      unsubscribeError();
      socketService.leaveRoom(currentRoom);
      socketService.disconnect();
      setIsConnected(false);
    };
  }, [token, user, navigate, currentRoom]);

  // 메시지 목록 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !isConnected) return;
    
    socketService.sendMessage(message, currentRoom);
    setMessage('');
  };

  const handleRoomChange = async (roomId: string) => {
    socketService.leaveRoom(currentRoom);
    setCurrentRoom(roomId);
    socketService.joinRoom(roomId);
    setMessages([]);
    setSystemMessages([]);
    
    try {
      const messagesData = await api.getChatMessages(roomId);
      setMessages(messagesData.reverse());
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    }
  };

  const handleLogout = () => {
    socketService.disconnect();
    logout();
    navigate('/login');
  };

  // 메시지 시간 포맷팅
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>채팅방: {rooms.find(r => r.id === currentRoom)?.name || currentRoom} 💬</h2>
        <div className="user-info">
          <span>{user?.MEMBERNAME || user?.MID} 님</span>
          <button onClick={handleLogout} className="logout-btn">로그아웃</button>
        </div>
      </div>
      
      <div className="chat-main">
        <div className="chat-sidebar">
          <h3>채팅방 목록</h3>
          <ul className="room-list">
            {rooms.map((room) => (
              <li 
                key={room.id}
                className={currentRoom === room.id ? 'active' : ''}
                onClick={() => handleRoomChange(room.id)}
              >
                <span className="room-name">{room.name}</span>
                <span className="room-description">{room.description}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="chat-content">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`message ${msg.senderId === user?.MID ? 'own-message' : ''}`}
              >
                <div className="message-header">
                  <span className="sender">{msg.senderName || msg.senderId}</span>
                  <span className="timestamp">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            
            {systemMessages.map((msg, index) => (
              <div key={`system-${index}`} className="system-message">
                {msg}
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              disabled={!isConnected}
            />
            <button type="submit" disabled={!isConnected}>전송</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
