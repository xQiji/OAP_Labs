import { TicketRepository } from "../repositories/ticket.repository";
import { CreateTicketDto, UpdateTicketDto } from "../dtos/ticket.dto";
import { ApiError } from "../utils/errors";

const repo = new TicketRepository();

export class TicketService {
  getAll(status?: string, page?: string, pageSize?: string) {
    const p = page ? parseInt(page, 10) : 1;
    const ps = pageSize ? parseInt(pageSize, 10) : 10;
    return repo.getAll(status, p, ps);
  }

  getById(id: string) {
    const ticket = repo.getById(parseInt(id, 10));
    if (!ticket) throw new ApiError(404, "NOT_FOUND", "Заявку не знайдено");
    return ticket;
  }

  create(dto: CreateTicketDto) {
    if (!dto.theme || dto.theme.trim() === "") {
      throw new ApiError(400, "VALIDATION_ERROR", "Тема є обов'язковою");
    }
    if (!dto.authorId) {
      throw new ApiError(400, "VALIDATION_ERROR", "Автор є обов'язковим");
    }
    return repo.create(dto);
  }

  update(id: string, dto: UpdateTicketDto) {
    const updated = repo.update(parseInt(id, 10), dto);
    if (!updated) throw new ApiError(404, "NOT_FOUND", "Заявку не знайдено");
    return updated;
  }

  delete(id: string) {
    const deleted = repo.delete(parseInt(id, 10));
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Заявку не знайдено");
  }
}