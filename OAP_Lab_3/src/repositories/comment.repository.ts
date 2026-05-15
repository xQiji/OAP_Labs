import { Comment, CreateCommentDto } from "../dtos/comment.dto";
import { all, get, run } from "../db/dbClient";

export class CommentRepository {
  // Дістаємо всі коментарі, які належать конкретній заявці
  getAllByTicketId(ticketId: number) {
    return all(`SELECT * FROM TicketsComments WHERE ticketId = ${ticketId}`);
  }

  getById(id: number): Comment | undefined {
    return get(`SELECT * FROM TicketsComments WHERE id = ${id}`);
  }

  create(dto: CreateCommentDto): Comment | undefined {
    const time = new Date().toISOString();
    
    // Тут уважно: body - це текст (в одинарних лапках), а ticketId та authorId - числа (без лапок)
    const sql = `INSERT INTO TicketsComments (body, ticketId, authorId, createdAt) VALUES ('${dto.body}', ${dto.ticketId}, ${dto.authorId}, '${time}')`;
    const info = run(sql);
    
    return this.getById(info.lastInsertRowid as number);
  }

  delete(id: number): boolean {
    const sql = `DELETE FROM TicketsComments WHERE id = ${id}`;
    const info = run(sql);
    return info.changes > 0;
  }
}