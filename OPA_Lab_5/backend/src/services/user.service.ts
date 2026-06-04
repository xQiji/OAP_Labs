import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { ApiError } from "../utils/errors";

const repo = new UserRepository();

export class UserService {
  getAll() {
    return repo.getAll();
  }

  getById(id: string) {
    const user = repo.getById(parseInt(id, 10));
    if (!user) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
    return user;
  }

  create(dto: CreateUserDto) {
    if (!dto.name || dto.name.trim() === "") {
      throw new ApiError(400, "VALIDATION_ERROR", "Ім'я є обов'язковим");
    }
    if (!dto.email || !dto.email.includes("@")) {
      throw new ApiError(400, "VALIDATION_ERROR", "Некоректний формат email");
    }
    return repo.create(dto);
  }

  update(id: string, dto: UpdateUserDto) {
    const updated = repo.update(parseInt(id, 10), dto);
    if (!updated) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
    return updated;
  }

  delete(id: string) {
    const deleted = repo.delete(parseInt(id, 10));
    if (!deleted) throw new ApiError(404, "NOT_FOUND", "Користувача не знайдено");
  }
}