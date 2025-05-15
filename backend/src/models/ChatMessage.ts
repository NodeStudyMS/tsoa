// backend/src/models/ChatMessage.ts

import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize";
import { Member } from "./Member";

// 인터페이스 정의
export interface IChatMessage {
  id?: number;
  content: string;
  senderId: string;
  roomId: string;
  createdAt?: Date;
}

export interface ChatMessageAttributes {
  id: number;
  content: string;
  senderId: string;
  roomId: string;
  createdAt: Date;
}

export interface ChatMessageCreationParams {
  content: string;
  senderId: string;
  roomId: string;
}

// Sequelize 모델 정의
export class ChatMessage
  extends Model<ChatMessageAttributes, ChatMessageCreationParams>
  implements ChatMessageAttributes
{
  public id!: number;
  public content!: string;
  public senderId!: string;
  public roomId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 모델 초기화
ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    senderId: {
      type: DataTypes.STRING(30),
      allowNull: false,
      references: {
        model: Member,
        key: "MID",
      },
    },
    roomId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "chat_messages",
    timestamps: true,
  }
);

// 관계 설정
ChatMessage.belongsTo(Member, { foreignKey: "senderId", as: "sender" });
