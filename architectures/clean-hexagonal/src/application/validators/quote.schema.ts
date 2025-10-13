import z from "zod";

/**
 * 2. DTO VALIDATION SCHEMA
 * Define las reglas de validación para los datos de creación de una cotización
 *
 */
export const createQuoteSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  amount: z.number().int().nonnegative(),
  status: z.enum(["pending", "approved"]).optional(),
});

export const updateQuoteSchema = z
  .object({
    customerName: z.string().trim().min(1).optional(),
    amount: z.number().int().nonnegative().optional(),
    status: z.enum(["pending", "approved"]).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: "empty patch" });
