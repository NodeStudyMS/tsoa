"use strict";
// backend/src/models/Board.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardModel = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../db/sequelize"));
// Sequelize 모델 클래스
class BoardModel extends sequelize_1.Model {
    // Board 인터페이스로 변환하는 메서드 (필요시 사용)
    toDTO() {
        return {
            BID: this.BID,
            BOARDTITLE: this.BOARDTITLE,
            BOARDCONTENT: this.BOARDCONTENT,
            BOARDREGDATE: this.BOARDREGDATE.toISOString(),
            MEMBERNAME: this.MEMBERNAME,
        };
    }
}
exports.BoardModel = BoardModel;
// 모델 초기화
BoardModel.init({
    BID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    BOARDTITLE: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    BOARDCONTENT: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    BOARDREGDATE: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    MEMBERNAME: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.default,
    modelName: "Board",
    tableName: "board",
    timestamps: false,
});
