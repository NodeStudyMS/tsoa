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
  getConnection: async () => {
    return await pool.getConnection();
  },
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
