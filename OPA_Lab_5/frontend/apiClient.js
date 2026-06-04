import { API_BASE_URL } from "./config.js";

async function request(path, options = {}, timeoutMs = 10000) {
    const url = `${API_BASE_URL}${path}`;
    
    // AbortController для скасування запиту, якщо сервер довго не відповідає
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(id); // Запит пройшов швидко, скасовуємо таймаут

        // Якщо бекенд відповідає статусом 204 (Немає тіла), просто повертаємо null
        if (response.status === 204) return null;

        const rawText = await response.text();

        // Якщо статус помилковий (400, 404, 500)
        if (!response.ok) {
            let errorData = null;
            try { errorData = JSON.parse(rawText); } catch { errorData = rawText; }
            
            throw {
                status: response.status,
                message: errorData?.title || errorData?.message || "HTTP помилка",
                details: errorData?.detail || rawText || `Помилка ${response.status}`
            };
        }

        // Якщо все добре, віддаємо JSON
        if (!rawText) return null;
        try { return JSON.parse(rawText); } catch { return rawText; }

    } catch (e) {
        clearTimeout(id);
        
        // Перехоплюємо таймаут
        if (e.name === "AbortError") {
            throw { status: 0, message: "Таймаут запиту", details: "Сервер задовго не відповідає" };
        }
        
        // Якщо це вже наша сформована помилка (HTTP) - прокидаємо далі
        if (e.status !== undefined) throw e; 
        
        // Якщо це помилка мережі або CORS
        throw { status: 0, message: "Помилка мережі або CORS", details: e.message };
    }
}

// === ЗОВНІШНІ ФУНКЦІЇ ДЛЯ ДОДАТКУ ===

export async function getTickets() {
    return await request("/tickets");
}

export async function createTicket(ticketData) {
    return await request("/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData)
    });
}

export async function deleteTicket(id) {
    return await request(`/tickets/${id}`, { method: "DELETE" });
}

export async function getUsers() {
    return await request("/users");
}