/**
 * 6. ROUTE
 * Definir las rutas para interactuar con las cotizaciones
 * Une controller -> service -> repository
 */

import { Router } from "express";
import { QuoteService } from "../../application/services/quote.service";
import { InMemoryQuoteRepository } from "../../infrastructure/repositories/InMemoryQuoteRepository";
import { QuoteController } from "../controllers/quote.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import { createQuoteSchema, updateQuoteSchema } from "../../application/validators/quote.schema";

// COMPOSICION DE DEPENDENCIAS (Manual DI)
// Hay dependencias entre las capas: Controller -> Service -> Repository
// Se crean las instancias y se inyectan las dependencias manualmente
// Definir repositorio
const repo = new InMemoryQuoteRepository();
// Definir service: asignar repo al service
const service = new QuoteService(repo);
// Definir controller: asignar service al controller
const controller = new QuoteController(service);

// Definir las rutas usando express.Router
export const quoteRouter = Router();

// Definir rutas y asignar métodos del controller
// Ruta para listar cotizaciones
quoteRouter.get("/", controller.list);

// Ruta para crear una nueva cotización
quoteRouter.post("/", validateBody(createQuoteSchema), controller.create);

// Obtener una cotización por id
quoteRouter.get("/:id", controller.get);

// Patch: actualizar una cotización por id
quoteRouter.patch("/:id", validateBody(updateQuoteSchema), controller.update);

// Delete: eliminar una cotización por id
quoteRouter.delete("/:id", controller.delete);
