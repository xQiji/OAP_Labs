import { Ticket, CreateTicketDto, UpdateTicketDto } from "../dtos/ticket.dto";
import { all, get, run } from "../db/dbClient";



export class TicketRepository {
  getAll(status?: string, page: number = 1, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;
  let items;
  if (status) {
    items = all(`SELECT * FROM Tickets WHERE status = '${status}' LIMIT ${pageSize} OFFSET ${offset}`);
  } else {
    items = all(`SELECT * FROM Tickets LIMIT ${pageSize} OFFSET ${offset}`);
  }
  const total = items.length;
  return { items, total };
  }

  getById(id: number): Ticket | undefined {
    return get(`SELECT * FROM Tickets WHERE id = ${id}`);
  }


  create(dto: CreateTicketDto): Ticket | undefined {
    const time = new Date().toISOString();

    const sql = `INSERT INTO Tickets(theme, status, priority, authorId, description, createdAt) VALUES ('${dto.theme}', '${dto.status}', '${dto.priority}', ${dto.authorId}, '${dto.description}', '${time}') `;
    const info = run(sql);
    return this.getById(info.lastInsertRowid);
  }

  update(id: number, dto: UpdateTicketDto): Ticket | undefined {
    const sql = `
    UPDATE Tickets 
    SET theme = '${dto.theme}', status = '${dto.status}', priority = '${dto.priority}', DESCRIPTION = '${dto.description}'
    WHERE id = ${id}
    `;
    const info = run(sql);
  if (info.changes > 0) {
    return this.getById(id);
  }
  return undefined;
  }

  delete(id: number): boolean {
    const sql = `DELETE FROM Tickets WHERE id = ${id}`;
    const info = run(sql);
    return info.changes > 0;
  }
}