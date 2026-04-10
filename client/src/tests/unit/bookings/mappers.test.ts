import { describe, expect, it } from "vitest";
import type { Room } from "@/api/contracts";
import {
  buildBookingReminderViewModel,
  formatReminderCountdown,
  formatReminderDeadline,
  formatReminderSchedule,
} from "@/features/bookings/mappers";

describe("booking reminder mappers", () => {
  const booking = {
    id: "booking-1",
    roomId: "room-1",
    roomCode: "RM-101",
    roomName: "Collaborative Study Suite 101",
    startsAt: "2026-04-10T09:00:00.000Z",
    endsAt: "2026-04-10T10:00:00.000Z",
    status: "active",
    checkedIn: false,
    createdAt: "2026-04-10T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
  } as const;

  const room: Room = {
    id: "room-1",
    roomCode: "RM-101",
    name: "Collaborative Study Suite 101",
    location: "Library, 2nd Floor - East Wing",
    capacity: 6,
    isActive: true,
    status: "operational",
    createdAt: "2026-04-10T00:00:00.000Z",
    amenities: [],
  };

  it("formats countdown, schedule, and check-in deadline labels", () => {
    const now = new Date("2026-04-10T08:30:00.000Z");

    expect(formatReminderCountdown(booking.startsAt, now)).toBe("begins in 30 minutes");
    expect(formatReminderSchedule(booking.startsAt, booking.endsAt, now)).toBe(
      "09:00 – 10:00 (Today)",
    );
    expect(formatReminderDeadline(booking.startsAt)).toBe("08:45");
  });

  it("builds the reminder view model from booking, room, and reminders", () => {
    const model = buildBookingReminderViewModel(
      booking,
      room,
      [
        {
          id: "reminder-1",
          bookingId: "booking-1",
          channel: "email",
          scheduledFor: "2026-04-10T08:30:00.000Z",
          sentAt: "2026-04-10T08:30:00.000Z",
          status: "delivered",
          failureReason: "",
          createdAt: "2026-04-10T08:29:00.000Z",
        },
      ],
      new Date("2026-04-10T08:30:00.000Z"),
    );

    expect(model.roomName).toBe("Collaborative Study Suite 101");
    expect(model.location).toBe("Library, 2nd Floor - East Wing");
    expect(model.countdownLabel).toBe("begins in 30 minutes");
    expect(model.scheduleLabel).toBe("09:00 – 10:00 (Today)");
    expect(model.checkInDeadlineLabel).toBe("08:45");
    expect(model.viewDetailsHref).toBe("/rooms/room-1");
    expect(model.directionsHref).toContain("Library%2C%202nd%20Floor%20-%20East%20Wing");
    expect(model.reminders).toEqual([
      expect.objectContaining({
        channelLabel: "Email",
        statusLabel: "Delivered",
        tone: "success",
      }),
    ]);
  });
});
