// backend/src/app.ts

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes';
import { createServer } from 'http';
import { setupSocketServer } from './socket/socketServer';
import { initDatabase } from './db/sequelize';
import { ChatService } from './services/ChatService';

export const app = express();

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static('public'));

// Swagger UI 설정
app.use('/docs', swaggerUi.serve, async (_req: express.Request, res: express.Response) => {
  return res.send(swaggerUi.generateHTML(await import('../public/swagger.json')));
});

// tsoa 라우트 등록
RegisterRoutes(app);

// 에러 핸들링
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  
  res.status(status).json({
    message,
    status
  });
});

// HTTP 서버 생성
const httpServer = createServer(app);

// Socket.io 설정
const io = setupSocketServer(httpServer);

// 서버 초기화 및 실행
async function initServer() {
  try {
    // 데이터베이스 초기화
    await initDatabase();
    
    // 기본 채팅방 초기화
    const chatService = new ChatService();
    await chatService.initializeDefaultRooms();
    
    // 서버 실행
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
      console.log(`서버가 시작되었습니다! http://localhost:${PORT}`);
      console.log(`Swagger UI: http://localhost:${PORT}/docs`);
      console.log(`Socket.io 서버가 실행 중입니다`);
    });
  } catch (error) {
    console.error('서버 초기화 실패:', error);
    process.exit(1);
  }
}

// 서버 실행 시 로그 출력
if (require.main === module) {
  initServer();
}
