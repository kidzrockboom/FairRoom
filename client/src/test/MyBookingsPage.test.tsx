import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MyBookingsPage from "../pages/dashboard/MyBookingsPage";

vi.mock("../api/fairroomApi", () => ({
  fairroomApi: {
    getMyBookings: vi.fn().mockResolvedValue({
      items: [
        {
          id: "bk_1",
          roomId: "room_1",
          roomCode: "RM-204",
          roomName: "Collaboration Lab 204",
          startsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: "active",
          checkedIn: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      page: 1,
      pageSize: 10,
      total: 1,
    }),
    getMyReminders: vi.fn().mockResolvedValue({
      items: [
        {
          id: "rem_1",
          bookingId: "bk_1",
          channel: "email",
          scheduledFor: new Date().toISOString(),
          sentAt: null,
          status: "scheduled",
          failureReason: null,
          createdAt: new Date().toISOString(),
        },
      ],
      total: 1,
    }),
    getRoom: vi.fn().mockResolvedValue({
      id: "room_1",
      roomCode: "RM-204",
      name: "Collaboration Lab 204",
      location: "Library",
      capacity: 6,
      isActive: true,
      createdAt: new Date().toISOString(),
    }),
  },
}));

describe("MyBookingsPage", () => {
  it("renders upcoming booking reminder", async () => {
    render(
      <MemoryRouter>
        <MyBookingsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading bookings/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Booking Reminder/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Collaboration Lab 204/i)).toBeInTheDocument();
  });
});
