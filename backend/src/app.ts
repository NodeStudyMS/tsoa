// backend/src/app.ts
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes/routes";
import { initDatabase } from "./db/sequelize";
import { ChatService } from "./services/ChatService";
import path from "path"; // path 모듈 추가

export const app = express();

// 미들웨어 설정
app.use(cors()); // CORS 설정 단순화 (같은 서버에서 서빙하므로)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 정적 파일 제공 - 절대 경로 사용
app.use(express.static(path.join(__dirname, "../public")));

// Swagger UI 설정
app.use(
  "/docs",
  swaggerUi.serve,
  async (_req: express.Request, res: express.Response) => {
    return res.send(
      swaggerUi.generateHTML(await import("../public/swagger.json"))
    );
  }
);

// tsoa 라우트 등록
RegisterRoutes(app);

// 에러 핸들링
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    res.status(status).json({
      message,
      status,
    });
  }
);

// API 경로 목록
const API_PATHS = ["/members", "/chat", "/docs"];
// React SPA 라우팅을 위한 설정 - 수정된 부분
app.use((req, res, next) => {
  // API 경로인지 확인
  const isApiPath = API_PATHS.some((apiPath) => req.path.startsWith(apiPath));

  // API 경로면 다음 핸들러로 넘김
  if (isApiPath) {
    return next();
  }

  // POST, PUT, DELETE 등의 API 요청이면 next()로 넘김
  if (req.method !== "GET") {
    return next();
  }
  // API 경로가 아니고 GET 요청이면 React 앱의 index.html 파일 제공 - 절대 경로 사용
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// 서버 초기화 함수 (server.ts에서 호출)
export async function initServer() {
  try {
    // 데이터베이스 초기화
    await initDatabase();

    // 기본 채팅방 초기화
    const chatService = new ChatService();
    await chatService.initializeDefaultRooms();

    console.log("서버 초기화 완료");
  } catch (error) {
    console.error("서버 초기화 실패:", error);
    throw error;
  }
}

// 직접 실행될 때만 초기화 (개발 중 테스트용)
if (require.main === module) {
  console.warn(
    "경고: app.ts를 직접 실행하지 마세요. server.ts를 통해 실행하세요."
  );
  initServer().catch((err) => {
    console.error("초기화 실패:", err);
    process.exit(1);
  });
}
