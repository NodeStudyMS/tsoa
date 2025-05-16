// backend/src/models/ChatRoom.ts

import { Model, DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

// 인터페이스 정의
export interface IChatRoom {
  id: string;
  name: string;
  description?: string | null;
  createdAt?: Date;
}

export interface ChatRoomAttributes {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}

export interface ChatRoomCreationParams {
  id: string;
  name: string;
  description?: string | null;
}

// Sequelize 모델 정의
export class ChatRoom
  extends Model<ChatRoomAttributes, ChatRoomCreationParams>
  implements ChatRoomAttributes
{
  public id!: string;
  public name!: string;
  public description!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 모델 초기화
ChatRoom.init(
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "chat_rooms",
    timestamps: true,
  }
);
