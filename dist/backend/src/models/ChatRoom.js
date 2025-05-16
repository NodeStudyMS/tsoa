"use strict";
// backend/src/models/ChatRoom.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
// Sequelize 모델 정의
class ChatRoom extends sequelize_1.Model {
}
exports.ChatRoom = ChatRoom;
// 모델 초기화
ChatRoom.init({
    id: {
        type: sequelize_1.DataTypes.STRING(50),
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "chat_rooms",
    timestamps: true,
});
