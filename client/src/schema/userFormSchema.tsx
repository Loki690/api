import { z } from 'zod';

export const userFormSchema = z.object({
  userCode: z
    .string()
    .min(5, { message: 'Username must be at least 5 character' })
    .max(50),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  password: z
    .string()
    .min(5, { message: 'Username must be at least 5 character' })
    .max(20),
  project: z.string(),
});

export const updateUserFormSchema = z.object({
  userCode: z
    .string()
    .min(5, { message: 'Username must be at least 5 character' })
    .max(50),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  //  project: z.string(),
});
