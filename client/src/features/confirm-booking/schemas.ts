import { z } from "zod";

export const createConfirmBookingSchema = (maxCapacity: number) =>
  z.object({
    purpose: z.string().min(5, "Please describe the purpose (at least 5 characters)"),
    expectedAttendees: z
      .number()
      .int()
      .min(1, "At least 1 attendee required")
      .max(maxCapacity, `Maximum capacity for this room is ${maxCapacity}`),
  });

export type ConfirmBookingFormValues = z.infer<
  ReturnType<typeof createConfirmBookingSchema>
>;
