import { Sequelize } from 'sequelize';

// MariaDB 연결 설정
const sequelize = new Sequelize({
  dialect: 'mariadb', // mariadb
  host: 'localhost', 
  username: 'root',
  password: '1234', // pw
  database: 'asgin', // db
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    timezone: 'Etc/GMT+9', // 시간 서울기준
    charset: 'utf8mb4' // utf-8 설정정
  },
  logging: console.log 
});

// 데이터베이스 연결 테스트 로그그
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공!');
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    throw error;
  }
};

// 데이터베이스 초기화 함수
// 초기화 안 하면 오류 날 수 있음.
export const initDatabase = async (): Promise<void> => {
  try {
    await testConnection();
    
    // 모델 동기화
    await sequelize.sync();
    console.log('모델 동기화 완료!');
  } catch (error) {
    console.error('데이터베이스 초기화 실패:', error);
    throw error;
  }
};

export default sequelize;
