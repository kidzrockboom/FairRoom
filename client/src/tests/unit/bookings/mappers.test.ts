import { describe, expect, it } from "vitest";
import type { BookingDetailResponse } from "@/api/contracts";
import {
  buildBookingDetailsViewModel,
  formatBookingCountdown,
  formatBookingDeadline,
  formatBookingSchedule,
} from "@/features/bookings/bookingDetailsMappers";

describe("booking details mappers", () => {
  const booking: BookingDetailResponse = {
    id: "booking-1",
    user: {
      id: "user-1",
      fullName: "Alice Johnson",
      email: "alice@example.com",
    },
    room: {
      id: "room-1",
      roomCode: "RM-101",
      name: "Collaborative Study Suite 101",
      location: "Library, 2nd Floor - East Wing",
    },
    startsAt: "2026-04-10T09:00:00.000Z",
    endsAt: "2026-04-10T10:00:00.000Z",
    status: "active",
    checkedIn: false,
    createdAt: "2026-04-10T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
  };

  it("formats countdown, schedule, and check-in deadline labels", () => {
    const now = new Date("2026-04-10T08:30:00.000Z");

    expect(formatBookingCountdown(booking.startsAt, now)).toBe("begins in 30 minutes");
    expect(formatBookingSchedule(booking.startsAt, booking.endsAt, now)).toBe(
      "09:00 – 10:00 (Today)",
    );
    expect(formatBookingDeadline(booking.startsAt)).toBe("08:45");
  });

  it("builds the booking details view model from booking payload", () => {
    const model = buildBookingDetailsViewModel(
      booking,
      new Date("2026-04-10T08:30:00.000Z"),
    );

    expect(model.roomName).toBe("Collaborative Study Suite 101");
    expect(model.location).toBe("Library, 2nd Floor - East Wing");
    expect(model.countdownLabel).toBe("begins in 30 minutes");
    expect(model.scheduleLabel).toBe("09:00 – 10:00 (Today)");
    expect(model.checkInDeadlineLabel).toBe("08:45");
    expect(model.bookingStatusLabel).toBe("Active");
  });
});
