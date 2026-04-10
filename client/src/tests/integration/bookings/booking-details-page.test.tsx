import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookingDetailsPage from "@/pages/BookingDetailsPage";
import { fairroomApi } from "@/api/fairroomApi";
import {
  formatBookingCountdown,
  formatBookingDeadline,
  formatBookingSchedule,
} from "@/features/bookings/bookingDetailsMappers";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getBooking: vi.fn(),
  },
}));

describe("BookingDetailsPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads booking details from the backend payload and renders the details view", async () => {
    const now = new Date();
    const startsAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
    const endsAt = new Date(now.getTime() + 90 * 60 * 1000).toISOString();

    vi.mocked(fairroomApi.getBooking).mockResolvedValue({
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
      startsAt,
      endsAt,
      status: "active",
      checkedIn: false,
      createdAt: "2026-04-10T00:00:00.000Z",
      updatedAt: "2026-04-10T00:00:00.000Z",
    });

    render(
      <MemoryRouter initialEntries={["/bookings/booking-1"]}>
        <Routes>
          <Route path="/bookings/:bookingId" element={<BookingDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Booking Details" })).toBeInTheDocument();
    });

    expect(screen.getByText("Collaborative Study Suite 101")).toBeInTheDocument();
    expect(screen.getByText("Library, 2nd Floor - East Wing")).toBeInTheDocument();
    expect(screen.getByText("Booking Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(
      screen.getByText("Collaborative Study Suite 101").closest("p"),
    ).toHaveTextContent(formatBookingCountdown(startsAt, now));
    expect(screen.getByText(formatBookingSchedule(startsAt, endsAt, now))).toBeInTheDocument();
    expect(screen.getByText(/Failure to check in will result/).closest("p")).toHaveTextContent(
      formatBookingDeadline(startsAt),
    );
    expect(fairroomApi.getBooking).toHaveBeenCalledWith("booking-1");
    expect(screen.getByRole("link", { name: "View My Bookings" })).toHaveAttribute(
      "href",
      "/bookings",
    );
  });

  it("shows an error when the booking cannot be loaded", async () => {
    vi.mocked(fairroomApi.getBooking).mockRejectedValue(new Error("Booking unavailable"));

    render(
      <MemoryRouter initialEntries={["/bookings/booking-1"]}>
        <Routes>
          <Route path="/bookings/:bookingId" element={<BookingDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Booking unavailable")).toBeInTheDocument();
    });
  });
});
