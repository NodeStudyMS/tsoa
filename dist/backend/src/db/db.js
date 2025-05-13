"use strict";
// src/db/db.ts
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
const mariadb_1 = __importDefault(require("mariadb"));
const pool = mariadb_1.default.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'asgin',
    connectionLimit: 10
});
exports.default = {
    // DB 연결 직접 가져오는 함수
    getConnection: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield pool.getConnection();
    }),
    // Query 실행 함수 sql : 실행할 SQL 문장, params : SQL에 전달할 값들
    query: (sql, params) => __awaiter(void 0, void 0, void 0, function* () {
        let conn;
        try {
            conn = yield pool.getConnection();
            return yield conn.query(sql, params);
        }
        finally {
            if (conn)
                conn.release();
        }
    })
};
