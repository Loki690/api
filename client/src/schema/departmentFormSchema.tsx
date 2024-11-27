import { z } from "zod";

export const departmentSchema = z.object({
  departmentName: z.string(),
  departmentDescription: z.string(),
});
