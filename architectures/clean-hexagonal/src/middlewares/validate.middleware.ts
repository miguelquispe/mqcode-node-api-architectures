import { NextFunction, Request, Response } from "express";
import z from "zod";

/**
 * 3. DTO VALIDATION MIDDLEWARE
 * Middleware para validar el cuerpo de la solicitud usando un esquema Zod
 * Usa el esquema para validar req.body
 * Si es válido, pasa al siguiente middleware/controlador
 * Si no, responde con 400 y detalles del error
 *
 */
export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    // Fail fast: si hay error, responder con 400 y mensaje
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      return next({ status: 400, message });
    }
    req.body = result.data; // datos validados y transformados
    next();
  };
}
