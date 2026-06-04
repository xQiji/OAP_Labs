import { getTickets, createTicket, deleteTicket, getUsers } from "./apiClient.js";

let tickets = [];
let editingId = null;

const form = document.getElementById("createForm");
const tbody = document.getElementById("ticketsTableBody");
const clearBtn = document.querySelector(".button-clear");
const submitBtn = document.querySelector(".button-add");
const statusDiv = document.getElementById("listStatus");
const noticeDiv = document.getElementById("notice");

// === СИСТЕМА ПОВІДОМЛЕНЬ (Toast) ===
function showNotice(text, isError = false) {
    noticeDiv.innerHTML = text;
    noticeDiv.style.color = isError ? "red" : "#4CAF50";
    setTimeout(() => noticeDiv.innerHTML = "", 5000); // Зникає через 5 секунд
}

// === 1. ЗАВАНТАЖЕННЯ АВТОРІВ ===
async function loadAuthors() {
    try {
        const usersData = await getUsers();
        const users = usersData?.items || usersData || [];
        
        const authorSelect = document.getElementById("author");
        let optionsHtml = '<option value="" disabled selected>Оберіть автора...</option>';
        optionsHtml += users.map(user => `<option value="${user.id}">${user.name}</option>`).join("");
        authorSelect.innerHTML = optionsHtml;
    } catch (error) {
        console.error("Помилка авторів:", error);
    }
}

// === 2. ЗАВАНТАЖЕННЯ ЗАЯВОК ===
async function loadTickets() {
    // Стан: Loading (виводимо рядок на всю ширину таблиці)
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #666; font-style: italic;">Завантаження списку заявок...</td></tr>`; 
    
    try {
        const data = await getTickets();
        tickets = data?.items || data || [];

        if (tickets.length === 0) {
            // Стан: Empty
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: #666; font-style: italic;">Поки що немає записів. Створіть першу заявку!</td></tr>`;
            return;
        }

        renderTable();
    } catch (error) {
        // Стан: Error
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: red;">Помилка завантаження: ${error.message}</td></tr>`;
    }
}

// Рендер таблиці
function renderTable() {
    tbody.innerHTML = tickets.map(ticket => `
        <tr>
            <td>${ticket.id}</td>
            <td>${ticket.theme}</td>
            <td>${ticket.priority}</td>
            <td>${ticket.status}</td>
            <td>${ticket.authorId}</td> 
            <td>${ticket.description || '—'}</td>
            <td>
                <button type="button" class="delete-btn" data-id="${ticket.id}">Видалити</button>
            </td>
        </tr>
    `).join("");
}

// === 3. СТВОРЕННЯ ЗАЯВКИ (Із захистом від подвійного кліку) ===
form.addEventListener("submit", async function(event) {
    event.preventDefault(); 

    const ticketData = {
        theme: document.getElementById("purpose-of-visit").value.trim(),
        priority: document.getElementById("prioritySelect").value,
        status: document.getElementById("statusSelect").value,
        authorId: Number(document.getElementById("author").value), 
        description: document.getElementById("description").value.trim()
    };

    // Блокуємо кнопку на час запиту
    submitBtn.disabled = true;
    submitBtn.textContent = "Збереження...";

    try {
        await createTicket(ticketData);
        showNotice("Заявку успішно створено!");
        form.reset();
        loadTickets(); // Оновлюємо таблицю
    } catch (error) {
        showNotice(`Помилка: ${error.message}`, true);
    } finally {
        // Розблоковуємо кнопку незалежно від результату
        submitBtn.disabled = false;
        submitBtn.textContent = "Додати";
    }
});

// === 4. ВИДАЛЕННЯ ЗАЯВКИ ===
tbody.addEventListener("click", async function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const btn = event.target;
        const idToDelete = Number(btn.dataset.id);
        
        btn.disabled = true;
        btn.textContent = "..."; // Анімація видалення

        try {
            await deleteTicket(idToDelete);
            showNotice("Заявку видалено!");
            loadTickets(); 
        } catch (error) {
            showNotice(`Не вдалося видалити: ${error.message}`, true);
            btn.disabled = false;
            btn.textContent = "Видалити";
        }
    }
});

// Скидання форми
clearBtn.addEventListener("click", function() {
    form.reset(); 
});

// --- СТАРТ ДОДАТКУ ---
loadAuthors();
loadTickets();