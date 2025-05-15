export interface User {
  MID: string;
  MEMBERNAME: string | null;
  MROLE: string;
}

export interface ChatMessage {
  id?: number;
  content: string;
  senderId: string;
  senderName: string;
  roomId: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
}

export interface UserJoinedEvent {
  userId: string;
  username: string;
  message: string;
}

export interface UserLeftEvent {
  userId: string;
  username: string;
  message: string;
}
