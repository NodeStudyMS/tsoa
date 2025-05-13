//src/server.ts

import { app } from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`Swagger UI available at http://0.0.0.0:${PORT}/api-docs`);
});
