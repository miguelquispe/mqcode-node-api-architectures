import pino from "pino";
import PinoHttp from "pino-http";

const isProd = process.env.NODE_ENV === "production";

// 1. Configura el logger base
// Por qué: un logger rápido y flexible es clave para producción
// Cómo: pino es rápido, soporta niveles, formatos y redacción
// Cuándo: siempre, incluso en dev (ajusta nivel)
// Ejemplo: en prod nivel 'info'; en dev 'debug' con colores
// Redacta datos sensibles (ejemplo: auth headers, passwords)
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: { translateTime: "SYS:standard", singleLine: true },
      },
  redact: {
    // evita filtrar datos sensibles en logs
    paths: ["req.headers.authorization", "password", "token"],
    censor: "[REDACTED]",
  },
});

// 2. Middleware para logging HTTP
// Por qué: loguear cada request/response es vital para debugging y monitoreo
// Cómo: pino-http se integra con Express y usa el logger base
// Cuándo: siempre, en todos los entornos
// Ejemplo: logs de método, URL, status, duración, id de request
export const httpLogger = PinoHttp({
  logger,
  autoLogging: true,
  // agrega un id simple para correlación de logs
  genReqId: (req) =>
    (req.headers["x-request-id"] as string) ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  // añade info util al contexto
  customProps: (req, res) => ({
    requestId: req.id,
    route: req.url,
    status: res.statusCode,
  }),
});
