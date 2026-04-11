import { describe, expect, it } from "vitest";
import {
  buildAdminBookingQuery,
  buildAdminBookingRowViewModel,
} from "@/features/admin/bookings/adminBookingsMappers";

describe("admin bookings mappers", () => {
  it("builds backend query params from the filter state", () => {
    expect(
      buildAdminBookingQuery("  Sarah  ", "active", "2026-04-10", 2, 24),
    ).toEqual({
      search: "Sarah",
      status: "active",
      startsAt: "2026-04-10T00:00:00",
      endsAt: "2026-04-10T23:59:59",
      page: 2,
      pageSize: 24,
    });
  });

  it("maps backend booking items to row view models", () => {
    expect(
      buildAdminBookingRowViewModel({
        id: "booking-1",
        user: {
          id: "user-123456",
          fullName: "Sarah Jenkins",
        },
        room: {
          id: "room-1",
          roomCode: "RM-101",
          name: "Collaborative Study Suite 101",
          location: "Library, 2nd Floor - East Wing",
        },
        startsAt: "2026-04-10T10:00:00",
        endsAt: "2026-04-10T12:00:00",
        status: "active",
        checkedIn: false,
        createdAt: "2026-04-10T00:00:00.000Z",
        updatedAt: "2026-04-10T00:00:00.000Z",
      }),
    ).toMatchObject({
      id: "booking-1",
      userFullName: "Sarah Jenkins",
      userInitials: "SJ",
      userRef: "USER-123",
      roomName: "Collaborative Study Suite 101",
      roomCode: "RM-101",
      roomLocation: "Library, 2nd Floor - East Wing",
      dateLabel: expect.any(String),
      timeLabel: expect.any(String),
      status: "active",
    });
  });
});
