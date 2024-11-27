import { z } from "zod";

export const subprojectSchema = z.object({
  subprojectName: z.string(),
  subprojectDescription: z.string(),
});
