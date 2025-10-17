import { db } from "../db/sqlite";
import { QuoteRepository } from "../../domain/ports/QuoteRepository";
import { Quote } from "../../domain/entities/Quote";

// DIP: Dependency Inversion Principle

/**
 * ADAPTER
 * Repositorio de cotizaciones usando Base de Datos (SQLite)
 * Implementa la interfaz QuoteRepository (Dominio) y sus métodos (Contrato)
 * El domínio no sabe nada de SQLite, solo de la interfaz(PORTS) (DIP)
 *
 * Nota:
 * La implementación puede cambiar de tecnología (otro motor de BD, archivo, etc)
 * para ello se debe crear otra clase que implemente la misma interfaz
 * y cambiar la inyección de dependencias en la composición (quote.routes.ts)
 *
 */

export class SqliteQuoteRepository implements QuoteRepository {
  findAll(): Promise<Quote[]> {
    const rows = db
      .prepare("SELECT * FROM quotes ORDER BY createdAt DESC")
      .all();
    return Promise.resolve(rows.map(rowToQuote));
  }

  findById(id: string): Promise<Quote | null> {
    const row = db.prepare("SELECT * FROM quotes WHERE id = ?").get(id);
    return Promise.resolve(row ? rowToQuote(row) : null);
  }

  create(data: Omit<Quote, "createdAt" | "updatedAt">): Promise<Quote> {
    const now = new Date();
    const q: Quote = { ...data, createdAt: now, updatedAt: now };
    db.prepare(
      `
      INSERT INTO quotes (id, customerName, amount, status, createdAt, updatedAt)
      VALUES (@id, @customerName, @amount, @status, @createdAt, @updatedAt)
    `
    ).run(quoteToRow(q));
    return Promise.resolve(q);
  }

  update(
    id: string,
    patch: Partial<Omit<Quote, "id" | "createdAt">>
  ): Promise<Quote | null> {
    const found = this.findByIdSync(id);
    if (!found) return Promise.resolve(null);
    const updated: Quote = { ...found, ...patch, updatedAt: new Date() };
    db.prepare(
      `
      UPDATE quotes SET
        customerName = @customerName,
        amount = @amount,
        status = @status,
        updatedAt = @updatedAt
      WHERE id = @id
    `
    ).run(quoteToRow(updated));
    return Promise.resolve(updated);
  }

  delete(id: string): Promise<boolean> {
    const info = db.prepare("DELETE FROM quotes WHERE id = ?").run(id);
    return Promise.resolve(info.changes > 0);
  }

  // helper sync interno
  private findByIdSync(id: string): Quote | null {
    const row = db.prepare("SELECT * FROM quotes WHERE id = ?").get(id);
    return row ? rowToQuote(row) : null;
  }
}

// Adaptadores
// mapeos: row <-> entidad
// De fila de DB a entidad de dominio
// por qué? Porque la DB usa strings para fechas y la entidad usa Date
function rowToQuote(row: any): Quote {
  return {
    id: row.id,
    customerName: row.customerName,
    amount: row.amount,
    status: row.status,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}
function quoteToRow(q: Quote) {
  return {
    ...q,
    createdAt: q.createdAt.toISOString(),
    updatedAt: q.updatedAt.toISOString(),
  };
}
