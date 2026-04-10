import { describe, expect, it } from "vitest";
import { buildBookingListItemViewModel } from "@/features/bookings/myBookingsMappers";

describe("my bookings mappers", () => {
  it("maps a booking into a list view model", () => {
    const now = new Date("2026-04-10T08:00:00.000Z");

    const viewModel = buildBookingListItemViewModel(
      {
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
      },
      now,
    );

    expect(viewModel).toEqual({
      id: "booking-1",
      roomName: "Collaborative Study Suite 101",
      roomCode: "RM-101",
      startsAt: "2026-04-10T09:00:00.000Z",
      endsAt: "2026-04-10T10:00:00.000Z",
      scheduleLabel: "09:00 – 10:00 (Today)",
      status: "active",
      statusLabel: "Active",
      statusTone: "success",
      canEdit: true,
      canCancel: true,
    });
  });

  it("marks completed bookings as non-cancellable", () => {
    const viewModel = buildBookingListItemViewModel({
      id: "booking-2",
      roomId: "room-1",
      roomCode: "RM-101",
      roomName: "Collaborative Study Suite 101",
      startsAt: "2026-04-09T09:00:00.000Z",
      endsAt: "2026-04-09T10:00:00.000Z",
      status: "completed",
      checkedIn: true,
      createdAt: "2026-04-09T00:00:00.000Z",
      updatedAt: "2026-04-09T00:00:00.000Z",
    }, new Date("2026-04-10T08:00:00.000Z"));

    expect(viewModel.canCancel).toBe(false);
    expect(viewModel.canEdit).toBe(false);
    expect(viewModel.statusTone).toBe("muted");
  });
});
