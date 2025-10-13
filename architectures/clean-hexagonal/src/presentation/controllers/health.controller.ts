import { Request, Response } from "express";

export function health(req: Request, res: Response) {
  res.json({ ok: true, uptime: process.uptime() });
}
