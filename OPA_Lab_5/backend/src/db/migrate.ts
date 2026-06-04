import fs from "fs";
import path from "path";
import { run, all } from "./dbClient";

export function migrate(): void {
  run("PRAGMA foreign_keys = ON;");

  run(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY,
    filename TEXT NOT NULL UNIQUE,
    appliedAt TEXT NOT NULL
  )`);

  const migrationsDir = path.join(__dirname, "..", "migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  const applied = all("SELECT filename FROM schema_migrations");
  const appliedSet = new Set(applied.map((r: any) => r.filename));

  for (const file of files) {
    if (appliedSet.has(file)) continue;
    
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

    const statements = sql.split(";").map(s => s.trim()).filter(s => s.length > 0);
    console.log("Statements:", statements);
    for (const statement of statements) {
      run(statement + ";");
    }

    run(`INSERT INTO schema_migrations (filename, appliedAt) VALUES ('${file}', '${new Date().toISOString()}')`);
  }
}