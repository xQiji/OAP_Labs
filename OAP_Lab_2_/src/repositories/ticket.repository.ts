import { Ticket, CreateTicketDto, UpdateTicketDto } from "../dtos/ticket.dto";

let tickets: Ticket[] = [];
let nextId = 1;

export class TicketRepository {
  getAll(status?: string, page: number = 1, pageSize: number = 10) {
    let filtered = tickets;
    if (status) {
      filtered = filtered.filter(t => t.status === status);
    }
    
    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);
    
    return { items, total }; 
  }

  getById(id: number): Ticket | undefined {
    return tickets.find(t => t.id === id);
  }

  create(data: CreateTicketDto): Ticket {
    const newTicket: Ticket = { id: nextId++, ...data };
    tickets.push(newTicket);
    return newTicket;
  }

  update(id: number, data: UpdateTicketDto): Ticket | undefined {
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    
    tickets[index] = { ...tickets[index], ...data };
    return tickets[index];
  }

  delete(id: number): boolean {
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return false;
    tickets.splice(index, 1);
    return true;
  }
}