// src/db/sequelize.ts
import { Sequelize } from 'sequelize';
import { Member } from '../models/Member';

// MariaDB 연결 설정을 Sequelize로 변환
const sequelize = new Sequelize({
  dialect: 'mariadb',
  host: 'localhost',
  username: 'root',
  password: '1234',
  database: 'asgin',
  pool: {
    max: 10,        // connectionLimit과 동일
    min: 0,
    acquire: 30000, // 연결 획득 제한시간 (ms)
    idle: 10000     // 유휴 상태 제한시간 (ms)
  },
  // MariaDB 특정 옵션
  dialectOptions: {
    timezone: 'Etc/GMT+9', // 한국 시간대 설정
    charset: 'utf8mb4'
  },
  logging: console.log 
});

// 모델 초기화
Member.initModel(sequelize);

// 데이터베이스 연결 테스트 함수
export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공!');
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
    throw error;
  }
};

// 모델들 내보내기 (추후 다른 모델 추가 시 확장 가능)
export const models = {
  Member
};

export default sequelize;
