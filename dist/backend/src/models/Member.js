"use strict";
// backend/src/models/member.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
// Sequelize 모델 정의 및 초기화를 한 번에 수행
class Member extends sequelize_1.Model {
    // toString override
    toString() {
        return `Member(MID: ${this.MID}, MEMBERNAME: ${this.MEMBERNAME}, MROLE: ${this.MROLE})`;
    }
}
exports.Member = Member;
// 모델 초기화
Member.init({
    MID: {
        type: sequelize_1.DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
    },
    MPW: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
    },
    MEMBERNAME: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: true,
    },
    MROLE: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: true,
        defaultValue: "user",
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "member",
    timestamps: true,
});
