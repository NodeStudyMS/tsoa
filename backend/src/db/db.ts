// src/db/db.ts

import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'asgin',
  connectionLimit: 10
});

export default {
  // DB 연결 직접 가져오는 함수
  getConnection: async () => {
    return await pool.getConnection();
  },
  // Query 실행 함수 sql : 실행할 SQL 문장, params : SQL에 전달할 값들
  query: async (sql: string, params?: any[]) => {
    let conn;
    try {
      conn = await pool.getConnection();
      return await conn.query(sql, params);
    } finally {
      if (conn) conn.release();
    }
  }
};
