import { User, CreateUserDto, UpdateUserDto } from "../dtos/user.dto";

// один користувача за замовчуванням, щоб список не був порожнім
let users: User[] = [
  { id: 1, name: "Іван Адмін", email: "admin@test.com" }
];
let nextId = 2;

export class UserRepository {
  getAll() {
    return { items: users, total: users.length };
  }

  getById(id: number): User | undefined {
    return users.find(u => u.id === id);
  }

  create(data: CreateUserDto): User {
    const newUser: User = { id: nextId++, ...data };
    users.push(newUser);
    return newUser;
  }

  update(id: number, data: UpdateUserDto): User | undefined {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    users[index] = { ...users[index], ...data };
    return users[index];
  }

  delete(id: number): boolean {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  }
}