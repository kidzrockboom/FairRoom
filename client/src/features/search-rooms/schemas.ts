import { z } from "zod";

export const filterSchema = z.object({
  date: z.string(),
  capacity: z.number().nullable(),
  timeRange: z
    .tuple([z.number(), z.number()])
    .refine(([start, end]) => start < end, "Start time must be before end time"),
});

export type Filters = z.infer<typeof filterSchema>;
