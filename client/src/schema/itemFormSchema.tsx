import { z } from "zod";

export const itemFormSchema = z.object({
  itemCode: z.string(),
  itemDescription: z.string(),
  unit: z.string(),
  qtyIn: z.coerce
    .number({ required_error: "required" })
    .int({ message: "must be an integer" })
    .gte(0, { message: "must be greater than or equal to 0" })
    .lte(10000, { message: "must be less than or equal to 10000" }),
  qtyOut: z.coerce
    .number({ required_error: "required" })
    .int({ message: "must be an integer" })
    .gte(0, { message: "must be greater than or equal to 0" })
    .lte(10000, { message: "must be less than or equal to 10000" }),
  stockOnHand: z.coerce
    .number({ required_error: "required" })
    .int({ message: "must be an integer" })
    .gte(0, { message: "must be greater than or equal to 0" })
    .lte(10000, { message: "must be less than or equal to 10000" }),
  toolLocator: z.string(),
  remarks: z.string(),
  project: z.string(),
});

export const updateItemFormSchema = z.object({
  itemCode: z.string(),
  itemDescription: z.string(),
  unit: z.string(),
  qtyIn: z.coerce
    .number({ required_error: "required" })
    .int({ message: "must be an integer" })
    .gte(0, { message: "must be greater than or equal to 0" })
    .lte(10000, { message: "must be less than or equal to 10000" }),
  qtyOut: z.coerce
    .number({ required_error: "required" })
    .int({ message: "must be an integer" })
    .gte(0, { message: "must be greater than or equal to 0" })
    .lte(10000, { message: "must be less than or equal to 10000" }),
  stockOnHand: z.coerce
    .number({ required_error: "required" })
    .int({ message: "must be an integer" })
    .gte(0, { message: "must be greater than or equal to 0" })
    .lte(10000, { message: "must be less than or equal to 10000" }),
  toolLocator: z.string(),
  remarks: z.string(),
});
