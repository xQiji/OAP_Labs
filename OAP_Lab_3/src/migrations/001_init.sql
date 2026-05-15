CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Tickets(
    id INTEGER PRIMARY KEY,
    theme TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN('new', 'in_progress', 'done')),
    authorId INTEGER NOT NULL,
    priority TEXT NOT NULL CHECK(priority IN('Low', 'Medium', 'High')),
    DESCRIPTION TEXT NOT NULL,
    createdAt TEXT NOT NULL,

    FOREIGN KEY (authorId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS TicketsComments(
    id INTEGER PRIMARY KEY,
    body TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    ticketId INTEGER NOT NULL,
    authorId INTEGER NOT NULL,
    FOREIGN KEY (ticketId) REFERENCES Tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES Users(id) ON DELETE CASCADE
);