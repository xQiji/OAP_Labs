// ==========================================
// 1. РОБОТА З LOCALSTORAGE ТА СТАН ДОДАТКУ
// ==========================================
const STORAGE_KEY = "lr1_tickets"; // Ключ, за яким ми зберігаємо дані

// Функція завантаження даних при старті
function loadFromStorage() {
  const json = localStorage.getItem(STORAGE_KEY);
  if (json === null) return []; // Якщо нічого немає, повертаємо порожній масив

  try {
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [];
  } catch {
    return []; // Якщо сталася помилка читання
  }
}

// Функція збереження даних
function saveToStorage(items) {
  const json = JSON.stringify(items);
  localStorage.setItem(STORAGE_KEY, json);
}

// Функція для правильного обчислення наступного ID після перезавантаження
function computeNextId(items) {
  if (items.length === 0) return 1;
  const maxId = Math.max(...items.map(x => x.id));
  return maxId + 1;
}

// Ініціалізуємо стан (читаємо з пам'яті, якщо там щось є)
let tickets = loadFromStorage();
let nextId = computeNextId(tickets);
let editingId = null;

// ==========================================
// 2. ЗНАХОДИМО ЕЛЕМЕНТИ НА СТОРІНЦІ
// ==========================================
const form = document.getElementById("createForm");
const tbody = document.getElementById("ticketsTableBody");
const clearBtn = document.querySelector(".button-clear");
const submitBtn = document.querySelector(".button-add");

// ==========================================
// 3. ФУНКЦІЯ ВІДОБРАЖЕННЯ ТАБЛИЦІ (Render)
// ==========================================
function renderTable() {
  tbody.innerHTML = ""; 
  
  let rowsHtml = tickets.map(ticket => `
    <tr>
      <td>${ticket.id}</td>
      <td>${ticket.theme}</td>
      <td>${ticket.priority}</td>
      <td>${ticket.status}</td>
      <td>${ticket.author}</td>
      <td>${ticket.description}</td>
      <td>
        <button type="button" class="edit-btn" data-id="${ticket.id}">Редагувати</button> 
        <button type="button" class="delete-btn" data-id="${ticket.id}">Видалити</button>
      </td>
    </tr>
  `).join("");

  tbody.innerHTML = rowsHtml;
}

// ==========================================
// 4. ОБРОБКА ВІДПРАВКИ ФОРМИ
// ==========================================
form.addEventListener("submit", function(event) {
  event.preventDefault(); 

  const theme = document.getElementById("purpose-of-visit").value.trim();
  const priority = document.getElementById("prioritySelect").value;
  const status = document.getElementById("statusSelect").value;
  const author = document.getElementById("author").value.trim();
  const description = document.getElementById("description").value.trim();

  // Валідація
  if (theme === "" || priority === "" || status === "" || author === "") {
    alert("Будь ласка, заповніть всі обов'язкові поля!");
    return; 
  }

  if (editingId === null) {
    // РЕЖИМ СТВОРЕННЯ
    const newTicket = {
      id: nextId,
      theme: theme,
      priority: priority,
      status: status,
      author: author,
      description: description
    };
    tickets.push(newTicket);
    nextId++;
  } else {
    // РЕЖИМ РЕДАГУВАННЯ
    const ticketIndex = tickets.findIndex(t => t.id === editingId);
    if (ticketIndex !== -1) {
      tickets[ticketIndex] = {
        id: editingId, 
        theme: theme,
        priority: priority,
        status: status,
        author: author,
        description: description
      };
    }
    editingId = null; 
    submitBtn.textContent = "Додати"; 
  }

  // ПІСЛЯ БУДЬ-ЯКОЇ ЗМІНИ: Зберігаємо в пам'ять і перемальовуємо
  saveToStorage(tickets);
  renderTable();
  form.reset();
});

// ==========================================
// 5. ОБРОБКА КНОПКИ "ОЧИСТИТИ"
// ==========================================
clearBtn.addEventListener("click", function() {
  form.reset(); 
  editingId = null;
  submitBtn.textContent = "Додати";
});

// ==========================================
// 6. ОБРОБКА КНОПОК "ВИДАЛИТИ" ТА "РЕДАГУВАТИ"
// ==========================================
tbody.addEventListener("click", function(event) {
  
  if (event.target.classList.contains("delete-btn")) {
    const idToDelete = Number(event.target.dataset.id);
    tickets = tickets.filter(ticket => ticket.id !== idToDelete);
    
    // ПІСЛЯ ВИДАЛЕННЯ: Зберігаємо в пам'ять і перемальовуємо
    saveToStorage(tickets);
    renderTable();
  }
  
  if (event.target.classList.contains("edit-btn")) {
    const idToEdit = Number(event.target.dataset.id);
    const ticket = tickets.find(t => t.id === idToEdit);
    
    if (ticket) {
      document.getElementById("purpose-of-visit").value = ticket.theme;
      document.getElementById("prioritySelect").value = ticket.priority;
      document.getElementById("statusSelect").value = ticket.status;
      document.getElementById("author").value = ticket.author;
      document.getElementById("description").value = ticket.description;
      
      editingId = ticket.id;
      submitBtn.textContent = "Зберегти зміни";
    }
  }
});

// ==========================================
// 7. ПЕРШИЙ РЕНДЕР ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ
// ==========================================
// Коли скрипт завантажується, ми одразу малюємо таблицю з тими даними, 
// які дістали з localStorage на самому початку файлу.
renderTable();