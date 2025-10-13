import { QuoteStatus } from "../../domain/entities/Quote";
import { QuoteRepository } from "../../domain/ports/QuoteRepository";
import crypto from "node:crypto";
import { UpdateQuoteDTO } from "../dto/quote.dto";
import { logger } from "../../utils/logger";

/**
 * 4. SERVICE
 * Crear el servicio de cotización que utiliza el repositorio de cotizaciones
 */

// Se encarga de la lógica de negocio relacionada con las cotizaciones
// Utiliza el repositorio para acceder a los datos
// Recibe el repositorio por inyección de dependencias (constructor)
// Métodos para listar y crear cotizaciones

export class QuoteService {
  constructor(private repo: QuoteRepository) {}

  async list() {
    return this.repo.findAll();
  }

  async create(dto: {
    customerName: string;
    amount: number;
    status?: QuoteStatus;
  }) {
    const id = crypto.randomUUID();
    // Valida el estado, si no es válido, asigna "pending"
    const status: QuoteStatus = dto.status ?? "pending"; // default “pending”
    return this.repo.create({
      id,
      customerName: dto.customerName,
      amount: dto.amount,
      status,
    });
  }

  async get(id: string) {
    return this.repo.findById(id);
  }

  async update(id: string, dto: UpdateQuoteDTO) {
    logger.info({ id, dto }, "Actualizando cotización");
    const updated = await this.repo.update(id, dto);
    if (!updated)
      logger.warn({ id }, "No se encontró la cotización para actualizar");
    return updated;
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }
}
