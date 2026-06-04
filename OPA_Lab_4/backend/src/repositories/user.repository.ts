import { User, CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { all, get, run } from "../db/dbClient";

export class UserRepository {
  
  getAll() {
    // 1. Дістаємо всі записи з бази
    const items = all(`SELECT * FROM Users`);
    return { items, total: items.length };
  }

  getById(id: number): User | undefined {
    // 2. Виправили назву таблиці на Users
    return get(`SELECT * FROM Users WHERE id = ${id}`);
  }

  create(dto: CreateUserDto): User | undefined {
    const time = new Date().toISOString(); // Додаємо час, бо таблиця цього просить

    // 3. Виправили синтаксис VALUES і додали час
    const sql = `INSERT INTO Users (name, email, createdAt) VALUES ('${dto.name}', '${dto.email}', '${time}')`;
    const info = run(sql);
    
    return this.getById(info.lastInsertRowid as number);
  }

  update(id: number, dto: UpdateUserDto): User | undefined {
    // 4. Виправили Tickets на Users
    const sql = `
    UPDATE Users 
    SET name = '${dto.name}', email = '${dto.email}' 
    WHERE id = ${id}`;
    
    const info = run(sql);
    if (info.changes > 0) {
      return this.getById(id);
    }
    return undefined;
  }

  delete(id: number): boolean {
    // 5. Виправили назву таблиці на Users
    const sql = `DELETE FROM Users WHERE id = ${id}`;
    const info = run(sql);
    return info.changes > 0;
  }
}