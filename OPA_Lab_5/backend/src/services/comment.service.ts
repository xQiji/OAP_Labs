import { CommentRepository } from "../repositories/comment.repository";
import { CreateCommentDto } from "../dtos/comment.dto";
import { ApiError } from "../utils/errors";

const repo = new CommentRepository();

export class CommentService {
  getAllByTicketId(ticketId: string) {
    if (!ticketId) throw new ApiError(400, "VALIDATION_ERROR", "ID заявки є обов'язковим");
    return repo.getAllByTicketId(parseInt(ticketId, 10));
  }

  getById(id: string) {
    const comment = repo.getById(parseInt(id, 10));
    if (!comment) throw new ApiError(404, "NOT_FOUND", "Коментар не знайдено");
    return comment;
  }

  create(dto: CreateCommentDto) {

    console.log("Я отримав такі дані від клієнта:", dto);
    // 1. Бронебійна перевірка на самому початку!
    if (!dto || !dto.body || dto.body.trim() === "") {
      throw new ApiError(400, "VALIDATION_ERROR", "Текст коментаря є обов'язковим");
    }
    // 2. Далі вже спокійно перевіряємо ID
    if (!dto.ticketId) {
      throw new ApiError(400, "VALIDATION_ERROR", "ID заявки є обов'язковим");
    }
    if (!dto.authorId) {
      throw new ApiError(400, "VALIDATION_ERROR", "ID автора є обов'язковим");
    }
    
    return repo.create(dto);
  }

  delete(id: string) {
    const deleted = repo.delete(parseInt(id, 10));
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Коментар не знайдено");
  }
}