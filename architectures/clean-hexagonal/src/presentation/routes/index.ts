import { Router } from "express";

import { health } from "../controllers/health.controller";
import { quoteRouter } from "./quote.routes";

const router = Router();
router.get("/health", health);

// Rutas para cotizaciones
router.use("/quotes", quoteRouter);

export default router;
