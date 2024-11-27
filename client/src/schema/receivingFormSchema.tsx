import { z } from "zod";

export const receivingItemSchema = z.object({
  items: z.array(
    z.object({
      item: z.string(),
      qtyIn: z.coerce
        .number({ required_error: "required" })
        .int({ message: "must be an integer" })
        .gte(0, { message: "must be greater than or equal to 0" })
        .lte(10000, { message: "must be less than or equal to 10000" }),
    })
  ),
  requistioner: z.string(),
  receivedBy: z.string(),
  dateReceived: z.date(),
  workOrderNo: z.string(),
  remarks: z.string(),
});

export const updatedReceivingItemSchema = z.object({
  items: z.array(
    z.object({
      item: z.string(),
      qtyIn: z.coerce
        .number({ required_error: "required" })
        .int({ message: "must be an integer" })
        .gte(0, { message: "must be greater than or equal to 0" })
        .lte(10000, { message: "must be less than or equal to 10000" }),
    })
  ),
  requistioner: z.string(),
  receivedBy: z.string(),
  dateReceived: z.date(),
  remarks: z.string(),
});
