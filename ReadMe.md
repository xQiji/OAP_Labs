# Лабораторна робота №2. Бекенд без БД

## 1. Як запустити проект
1. Відкрийте папку проекту в терміналі.
2. Встановіть залежності командою:
   `npm install`
3. Запустіть сервер у режимі розробки:
   `npm run dev`
4. Сервер буде доступний за адресою: `http://localhost:3000`

## 2. Список реалізованих сутностей
У проекті реалізовано 2 сутності згідно з вимогами (варіант 9 - Заявка в техпідтримку):
1. **Users** (Користувачі)
2. **Tickets** (Заявки)

## 3. Приклади запитів (curl)

**Отримати список заявок (GET):**
```bash
curl.exe -i http://localhost:3000/api/tickets

Створити нову заявку (POST):
curl.exe -i -X POST http://localhost:3000/api/tickets \
-H "Content-Type: application/json" \
-d "{\"theme\":\"Проблема з мережею\",\"priority\":\"High\",\"status\":\"New\",\"author\":\"Іван\",\"description\":\"Не працює інтернет\"}"

Створити користувача (POST):
curl.exe -i -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d "{\"name\":\"Олена\",\"email\":\"olena@test.com\"}"