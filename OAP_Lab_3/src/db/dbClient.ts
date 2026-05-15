import Database from "better-sqlite3";
import path from "path";

console.log("DB path:", path.join(__dirname, "..", "data", "app.db"));
const db = new Database(path.join(__dirname, "..", "data", "app.db"));

export default db;


export function all(sql: string): any[] {
  return db.prepare(sql).all();
}

export function get(sql: string): any {
  return db.prepare(sql).get();
}

export function run(sql: string): any {
  return db.prepare(sql).run();
}