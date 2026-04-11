import { describe, expect, it } from "vitest";
import { createConfirmBookingSchema } from "@/features/confirm-booking/schemas";

describe("confirm booking schemas", () => {
  it("accepts a valid booking payload", () => {
    const schema = createConfirmBookingSchema(6);
    const result = schema.safeParse({
      purpose: "Study group review",
      expectedAttendees: 4,
    });

    expect(result.success).toBe(true);
  });

  it("rejects attendee counts over capacity", () => {
    const schema = createConfirmBookingSchema(6);
    const result = schema.safeParse({
      purpose: "Study group review",
      expectedAttendees: 8,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Maximum capacity for this room is 6");
    }
  });
});
