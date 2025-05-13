"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = process.env.PORT || 3000;
app_1.app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
    console.log(`API 문서: http://localhost:${port}/docs`);
});
