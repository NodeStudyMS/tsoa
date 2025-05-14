"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = exports.testConnection = void 0;
const sequelize_1 = require("sequelize");
// MariaDB 연결 설정
const sequelize = new sequelize_1.Sequelize({
    dialect: 'mariadb',
    host: 'localhost',
    username: 'root',
    password: '1234',
    database: 'asgin',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        timezone: 'Etc/GMT+9',
        charset: 'utf8mb4'
    },
    logging: console.log
});
// 데이터베이스 연결 테스트 함수
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('데이터베이스 연결 성공!');
    }
    catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        throw error;
    }
});
exports.testConnection = testConnection;
// 데이터베이스 초기화 함수
const initDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, exports.testConnection)();
        // 모델 동기화
        yield sequelize.sync();
        console.log('모델 동기화 완료!');
    }
    catch (error) {
        console.error('데이터베이스 초기화 실패:', error);
        throw error;
    }
});
exports.initDatabase = initDatabase;
exports.default = sequelize;
