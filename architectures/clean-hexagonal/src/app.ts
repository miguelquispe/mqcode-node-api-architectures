import express from "express";

import routesV1 from "./presentation/routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/api/v1", routesV1);

  // 404 y errores
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
