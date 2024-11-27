import { z } from 'zod';

export const issuanceListSchema = z.object({
  dateIssued: z.date(),
  stockIssuanceNo: z.string(),
  department: z.string(),
  projects: z.string(),
  purpose: z.string(),
  requisitioner: z.string(),
  members: z.string().array(),
  receivedBy: z.string(),
  releasedBy: z.string(),
  approvedBy: z.string(),
  remarks: z.string(),
  items: z.array(
    z.object({
      item: z.string(),
      qtyOut: z.coerce
        .number({ required_error: 'required' })
        .int({ message: 'must be an integer' })
        .gte(0, { message: 'must be greater than or equal to 0' })
        .lte(10000, { message: 'must be less than or equal to 10000' }),
    })
  ),
});

export const issuanceItemListChema = z.object({
  items: z.array(
    z.object({
      item: z.string(),
      qtyOut: z.coerce
        .number({ required_error: 'required' })
        .int({ message: 'must be an integer' })
        .gte(0, { message: 'must be greater than or equal to 0' })
        .lte(10000, { message: 'must be less than or equal to 10000' }),
    })
  ),
});
