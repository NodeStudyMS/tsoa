"use strict";
//src/server.ts
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app_1.app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
    console.log(`Swagger UI available at http://0.0.0.0:${PORT}/api-docs`);
});
