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
import {
  createQuoteSchema,
  updateQuoteSchema,
} from "../../application/validators/quote.schema";
import { SqliteQuoteRepository } from "../../infrastructure/repositories/SqliteQuoteRepository";

const useDb = process.env.USE_DB === "true";

// DIP: Dependency Inversion Principle
// DI: Dependency Injection

// COMPOSICIÓN DE DEPENDENCIAS (DI)
// Flujo: Controller -> Service -> Repository (abstracción/port)
// El controller depende del service, el service del repository que implementa el contrato (port/interface)
// Esto cumple DIP: el dominio no depende de detalles de infraestructura.
// Beneficio: puedes swapear el adapter (InMemory, SQLite, Mongo) sin tocar Service/Controller.

// Composition root
// Se crean las instancias y se inyectan las dependencias
const repo = useDb
  ? new SqliteQuoteRepository()
  : new InMemoryQuoteRepository();
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
