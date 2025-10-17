// Entidad: Quote
import { Quote } from "../entities/Quote";
// SOLID: SRP - Single Responsibility Principle:
// Una clase debe tener una única responsabilidad

// SOLID: DIP - Dependency Inversion Principle:
// Las dependencias deben depender de abstracciones, no de concreciones

// Patrón Repository: Lugar donde se almacenan y recuperan las cotizaciones (Domain Driven Design)
// Nombra los puertos de salida y sus adaptadores de salida (arquitectura hexagonal)
// Define las operaciones que se pueden realizar con las cotizaciones
// Abstracción de la capa de persistencia
// Permite cambiar la implementación de almacenamiento sin afectar el resto del sistema
// Facilita las pruebas unitarias al poder mockear el repositorio
// Ejemplo: podrías tener una implementación en memoria para pruebas y otra con una base de datos real

/**
 * 2. PORT (Interface)
 * Los puertos son interfaces que definen las operaciones que se pueden realizar
 * en el dominio. Estas interfaces son implementadas por los adaptadores de salida.
 */

// Port: QuoteRepository (abstracción)
// Puerto de salida para la gestión de cotizaciones
// Define las operaciones que se pueden realizar con las cotizaciones (Contrato)
// La implementación concreta (adaptador) puede variar (BD, archivo, etc)

export interface QuoteRepository {
  findAll(): Promise<Quote[]>;
  findById(id: string): Promise<Quote | null>;
  create(data: Omit<Quote, "createdAt" | "updatedAt">): Promise<Quote>;
  update(
    id: string,
    patch: Partial<Omit<Quote, "id" | "createdAt">>
  ): Promise<Quote | null>; // 👈
  delete(id: string): Promise<boolean>;
}
