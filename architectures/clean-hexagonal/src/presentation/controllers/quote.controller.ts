/**
 * 5. CONTROLLER
 * Controlador para manejar las solicitudes relacionadas con cotizaciones
 */

import { NextFunction, Request, Response } from "express";
import { QuoteService } from "../../application/services/quote.service";

// Se encarga de recibir las solicitudes, llamar al servicio y retornar respuestas
// Recibe el servicio por inyección de dependencias (constructor)
// Métodos para listar y crear cotizaciones
export class QuoteController {
  constructor(private service: QuoteService) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const quotes = await this.service.list();
      res.json(quotes);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quote = await this.service.create(req.body);
      res.status(201).json(quote);
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quote = await this.service.get(req.params.id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found", status: 404 });
      }
      res.json(quote);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Quote not found", status: 404 });
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.service.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Quote not found", status: 404 });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
