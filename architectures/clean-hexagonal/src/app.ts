import express from "express";

// Agrega middlewares de seguridad
import helmet from "helmet";

// Agrega CORS para controlar orígenes web
import cors from "cors";

// Limita peticiones por IP
import rateLimit from "express-rate-limit";

// Logger rápido

import routesV1 from "./presentation/routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { httpLogger } from "./utils/logger";

// Patrón App Factory
// Por qué: permite crear múltiples instancias de la app con distinta configuración
// Ejemplo: tests, entornos, etc.
// Cómo: encapsula setup en función que devuelve app configurada
// Cuándo: siempre, es buena práctica y no añade complejidad
export function createApp() {
  const app = express();

  // 1) Seguridad por defecto (cabeceras)
  // Por qué: reduce superficie de ataque (XSS, sniffing, etc.)
  app.use(helmet());

  // 2) CORS
  // Para qué: definir qué front-ends pueden llamar tu API
  // Cuándo: en dev permitir todos; en prod especifica dominios
  app.use(
    cors({
      origin: process.env.NODE_ENV === "production" ? "https://miapp.com" : "*",
      credentials: false, // si usas cookies/autenticación, pon true y ajusta origen
    })
  );

  // 3) Body parser JSON (tamaño moderado)
  // Por qué: parsea JSON y limita tamaño para evitar abusos
  app.use(express.json({ limit: "1mb" }));

  // 4) Logging HTTP con Pino
  // Para qué: rastrear cada request/response (método, URL, status, duración)
  app.use(httpLogger);

  // 5) Rate limit (anti-abuso)
  // Para qué: evitar floods/ataques simples
  // Cuándo: siempre; ajusta umbrales por entorno
  // Por qué: protege recursos y mantiene disponibilidad
  // Ejemplo: Si el usuario hace más de 60 req/min, bloqueamos
  // En dev podemos dar límites más altos para pruebas

  app.use(
    rateLimit({
      windowMs: 60_000, // 1 minuto
      max: process.env.NODE_ENV === "production" ? 60 : 200, // prod/dev
      standardHeaders: true, // devuelve información de límite en las cabeceras
      legacyHeaders: false, // desactiva cabeceras obsoletas
      message: { error: { message: "Too many requests", status: 429 } },
    })
  );

  app.use("/api/v1", routesV1);

  // 404 y errores
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
