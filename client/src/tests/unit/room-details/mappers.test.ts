import { describe, expect, it } from "vitest";
import { deriveTimeSlots } from "@/features/room-details/mappers";

describe("room details mappers", () => {
  it("marks overlapping bookings as reserved", () => {
    const slots = deriveTimeSlots(
      [
        {
          id: "booking-1",
          roomId: "room-1",
          roomCode: "RM-101",
          roomName: "Collaborative Study Suite 101",
          startsAt: "2026-04-10T10:00:00",
          endsAt: "2026-04-10T12:00:00",
          status: "active",
          checkedIn: false,
          createdAt: "2026-04-10T00:00:00.000Z",
          updatedAt: "2026-04-10T00:00:00.000Z",
        },
        {
          id: "booking-2",
          roomId: "room-1",
          roomCode: "RM-101",
          roomName: "Collaborative Study Suite 101",
          startsAt: "2026-04-10T14:00:00",
          endsAt: "2026-04-10T15:00:00",
          status: "cancelled",
          checkedIn: false,
          createdAt: "2026-04-10T00:00:00.000Z",
          updatedAt: "2026-04-10T00:00:00.000Z",
        },
      ],
      "2026-04-10",
    );

    const tenAm = slots.find((slot) => slot.time === "10:00 AM");
    const elevenAm = slots.find((slot) => slot.time === "11:00 AM");
    const twoPm = slots.find((slot) => slot.time === "02:00 PM");

    expect(tenAm?.status).toBe("reserved");
    expect(elevenAm?.status).toBe("reserved");
    expect(twoPm?.status).toBe("available");
  });
});
