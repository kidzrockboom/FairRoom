import { describe, expect, it } from "vitest";
import {
  formatBookingDate,
  formatSlotRange,
  toCreateBookingRequest,
} from "@/features/confirm-booking/mappers";

describe("confirm booking mappers", () => {
  it("maps form values into a create booking request", () => {
    const request = toCreateBookingRequest("room-1", "2026-04-10", 9, {
      purpose: "Project review session",
      expectedAttendees: 4,
    });

    expect(request).toEqual({
      roomId: "room-1",
      startsAt: "2026-04-10T09:00:00",
      endsAt: "2026-04-10T10:00:00",
      purpose: "Project review session",
      expectedAttendees: 4,
    });
  });

  it("formats slot ranges and dates for display", () => {
    expect(formatSlotRange(9)).toBe("09:00 AM – 10:00 AM");
    expect(formatBookingDate("2026-04-10")).toBe("Friday, April 10, 2026");
  });
});
