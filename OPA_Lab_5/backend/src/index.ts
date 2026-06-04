import express from "express";
import { migrate } from "./db/migrate";
import { ticketRouter } from "./controllers/ticket.controller";
import { userRouter } from "./controllers/user.controller";
import { requestLogger, errorHandler } from "./middleware/app.middleware";
import { commentRouter } from "./controllers/comment.controller";


const app = express();

// Дозволяємо фронтенду робити запити до нашого сервера (CORS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});



// Дозволяємо серверу розуміти JSON тіло запиту
app.use(express.json());

// Підключаємо логування
app.use(requestLogger);

// Підключаємо наші маршрути для заявок
app.use("/api/comments", commentRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/users", userRouter);

// Підключаємо обробник помилок 
app.use(errorHandler);

try {
  migrate();
  console.log("Migrations done");
} catch (e) {
  console.error("Migration error:", e);
}
// Запускаємо сервер
app.listen(3000, () => {
  console.log("API started on http://localhost:3000");
});