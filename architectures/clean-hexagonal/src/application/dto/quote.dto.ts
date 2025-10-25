/**
 * 1. DTO (Data Transfer Object) para crear una cotización
 * Define la estructura de los datos necesarios para crear una cotización
 */
export type CreateQuoteDTO = {
  customerName: string;
  amount: number;
  status?: "pending" | "approved";
};

export type UpdateQuoteDTO = Partial<CreateQuoteDTO>;
