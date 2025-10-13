export type QuoteStatus = "pending" | "approved";

// Entidad que representa una cotización en el sistema (Domain Driven Design)

/**
 * 1. Entity
 * Crear la entidad con sus atributos y tipos de datos
 */

export interface Quote {
  id: string;
  customerName: string; // nombre del cliente/empresa
  amount: number; // en centavos (evita decimales)
  status: QuoteStatus; // estado simple
  createdAt: Date;
  updatedAt: Date;
}
