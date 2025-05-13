//src/server.ts

import { app } from './app';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
  console.log(`API 문서: http://localhost:${port}/docs`);
});
