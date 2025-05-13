//src/app.ts

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes';

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

// 서버 실행 시 로그 출력
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`서버가 시작되었습니다! http://localhost:${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/docs`);
  });
}
