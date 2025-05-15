"use strict";
// backend/src/models/ChatMessage.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
const Member_1 = require("./Member");
// Sequelize 모델 정의
class ChatMessage extends sequelize_1.Model {
}
exports.ChatMessage = ChatMessage;
// 모델 초기화
ChatMessage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    senderId: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        references: {
            model: Member_1.Member,
            key: "MID",
        },
    },
    roomId: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "chat_messages",
    timestamps: true,
});
// 관계 설정
ChatMessage.belongsTo(Member_1.Member, { foreignKey: "senderId", as: "sender" });
