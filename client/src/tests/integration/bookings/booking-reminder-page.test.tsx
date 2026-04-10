import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookingReminderPage from "@/pages/BookingReminderPage";
import { fairroomApi } from "@/api/fairroomApi";
import {
  formatReminderCountdown,
  formatReminderDeadline,
  formatReminderSchedule,
} from "@/features/bookings/mappers";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getRoom: vi.fn(),
    getMyReminders: vi.fn(),
  },
}));

describe("BookingReminderPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads the booking reminder data and renders the reminder history", async () => {
    const now = new Date();
    const startsAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    const endsAt = new Date(now.getTime() + 90 * 60 * 1000).toISOString();

    vi.mocked(fairroomApi.getRoom).mockResolvedValue({
      id: "room-1",
      roomCode: "RM-101",
      name: "Collaborative Study Suite 101",
      location: "Library, 2nd Floor - East Wing",
      capacity: 6,
      isActive: true,
      status: "operational",
      createdAt: "2026-04-10T00:00:00.000Z",
      amenities: [],
    });

    vi.mocked(fairroomApi.getMyReminders).mockResolvedValue([
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
      {
        id: "reminder-2",
        bookingId: "booking-1",
        channel: "sms",
        scheduledFor: "2026-04-10T08:30:00.000Z",
        sentAt: "2026-04-10T08:30:00.000Z",
        status: "scheduled",
        failureReason: "",
        createdAt: "2026-04-10T08:29:30.000Z",
      },
    ]);

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/bookings/reminder",
            state: {
              booking: {
                id: "booking-1",
                roomId: "room-1",
                roomCode: "RM-101",
                roomName: "Collaborative Study Suite 101",
                startsAt,
                endsAt,
                status: "active",
                checkedIn: false,
                createdAt: "2026-04-10T00:00:00.000Z",
                updatedAt: "2026-04-10T00:00:00.000Z",
              },
            },
          },
        ]}
      >
        <BookingReminderPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Booking Reminder" })).toBeInTheDocument();
    });

    expect(screen.getByText("Collaborative Study Suite 101")).toBeInTheDocument();
    expect(screen.getByText("Library, 2nd Floor - East Wing")).toBeInTheDocument();
    expect(screen.getByText("Collaborative Study Suite 101").closest("p")).toHaveTextContent(
      formatReminderCountdown(startsAt, now),
    );
    expect(screen.getByText(formatReminderSchedule(startsAt, endsAt, now))).toBeInTheDocument();
    expect(
      screen.getByText(/Please arrive on time\./).closest("p"),
    ).toHaveTextContent(formatReminderDeadline(startsAt));
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByText("SMS")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();

    expect(fairroomApi.getRoom).toHaveBeenCalledWith("room-1");
    expect(fairroomApi.getMyReminders).toHaveBeenCalledWith({
      bookingId: "booking-1",
      pageSize: 10,
    });

    expect(screen.getByRole("link", { name: "View Details" })).toHaveAttribute(
      "href",
      "/rooms/room-1",
    );
  });

  it("shows an error when the reminder data cannot be loaded", async () => {
    const now = new Date();
    const startsAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    const endsAt = new Date(now.getTime() + 90 * 60 * 1000).toISOString();

    vi.mocked(fairroomApi.getRoom).mockRejectedValue(new Error("Room unavailable"));

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/bookings/reminder",
            state: {
              booking: {
                id: "booking-1",
                roomId: "room-1",
                roomCode: "RM-101",
                roomName: "Collaborative Study Suite 101",
                startsAt,
                endsAt,
                status: "active",
                checkedIn: false,
                createdAt: "2026-04-10T00:00:00.000Z",
                updatedAt: "2026-04-10T00:00:00.000Z",
              },
            },
          },
        ]}
      >
        <BookingReminderPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Room unavailable")).toBeInTheDocument();
    });
  });
});
