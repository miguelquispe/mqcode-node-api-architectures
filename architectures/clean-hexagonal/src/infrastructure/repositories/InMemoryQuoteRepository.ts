/*
 * 3. ADAPTER
 * Crear la implementación en memoria del repositorio de cotizaciones
 */

import { Quote } from "../../domain/entities/Quote";
import { QuoteRepository } from "../../domain/ports/QuoteRepository";

// Debe implementar la interfaz QuoteRepository y sus métodos (Contrato)
export class InMemoryQuoteRepository implements QuoteRepository {
  // Implementación en memoria usando un Map
  // Clave: id de la cotización, Valor: objeto Quote
  // Por qué Map? Porque es eficiente para búsquedas, inserciones y eliminaciones
  // Por qué se inicializa vacío? Porque es una implementación en memoria para pruebas
  // No persiste datos entre ejecuciones, ideal para tests y desarrollo
  private data = new Map<string, Quote>();

  // Método para obtener todas las cotizaciones
  async findAll(): Promise<Quote[]> {
    // Convierte los valores del Map a un array y lo retorna
    return Array.from(this.data.values());
  }

  // Método para encontrar una cotización por su id
  async findById(id: string): Promise<Quote | null> {
    return this.data.get(id) ?? null;
  }

  // Método para crear una nueva cotización
  async create(input: Omit<Quote, "createdAt" | "updatedAt">): Promise<Quote> {
    const now = new Date();
    const quote: Quote = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    // Guarda la cotización en el Map usando su id como clave
    this.data.set(quote.id, quote);
    //
    return quote;
  }

  // Método para actualizar una cotización existente
  async update(id: string, patch: Partial<Omit<Quote, "id" | "createdAt">>): Promise<Quote | null> {
    const existing = this.data.get(id);
    if (!existing) return null;

    const updated: Quote = {
      ...existing,
      ...patch,
      updatedAt: new Date(),
    };
    this.data.set(id, updated);
    return updated;
  }

  // Método para eliminar una cotización por su id
  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }
}
