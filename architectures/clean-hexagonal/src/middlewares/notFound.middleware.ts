import { Request, Response } from "express";

/**
 * Middleware
 * Un middleware es una función que tiene acceso al objeto de solicitud (req),
 * al objeto de respuesta (res) y a la siguiente función de middleware en el ciclo
 * de solicitud/respuesta de la aplicación. La siguiente función de middleware
 * se denota comúnmente con una variable llamada next.
 * Ejemplo: el usuario hace una petición a /api/v1/quotes
 * - El request pasa por varios middlewares (logging, auth, rate limit, etc.)
 * - Si ningún middleware responde, llega a la ruta /api/v1/quotes
 * - Si la ruta no existe, pasa al middleware notFound
 * - El middleware notFound responde con un 404
 * - Si hay un error en cualquier parte, pasa al middleware errorHandler
 * - El middleware errorHandler responde con un 500 y mensaje de error
 */

// Middleware para manejar rutas no encontradas (404)
export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: { message: "Not Found", status: 404 } });
}
