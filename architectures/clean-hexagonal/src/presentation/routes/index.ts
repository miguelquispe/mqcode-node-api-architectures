import { Router } from "express";

import { health } from "../controllers/health.controller";
import { quoteRouter } from "./quote.routes";

const router = Router();
// Ruta de health check
// Por qué: endpoint simple para monitoreo y orquestación
// Qué: responde 200 OK si la app está viva
// Cuándo: siempre, es buena práctica tenerlo
// Ejemplo: Kubernetes usa /health para saber si el contenedor va bien
router.get("/health", health);

// Rutas para cotizaciones
router.use("/quotes", quoteRouter);

export default router;
