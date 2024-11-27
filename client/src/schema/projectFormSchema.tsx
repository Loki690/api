import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.enum(["Active", "Inactive"]),
  prefix: z.string(),
});
