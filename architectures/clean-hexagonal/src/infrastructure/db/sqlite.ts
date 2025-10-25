import Database from "better-sqlite3";

// Conexión a la base de datos SQLite
// Crear carpeta "data" si no existe en la raíz del proyecto
export const db = new Database("data/quotes.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);
