import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// 1. Вказуємо шлях до папки data (вона буде на рівень вище за папку src)
const dataDir = path.join(__dirname, '..', '..', 'data'); 
const dbPath = path.join(dataDir, 'app.db');

// 2. Якщо папки data ще немає — створюємо її
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 3. Відкриваємо (або створюємо) файл бази даних
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Помилка підключення до SQLite:", err.message);
    process.exit(1);
  }
  console.log("Успішно підключено до бази даних:", dbPath);
});