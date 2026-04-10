import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConfirmBookingPage from "@/pages/ConfirmBookingPage";
import { fairroomApi } from "@/api/fairroomApi";
import { submitBooking } from "@/features/confirm-booking/confirmBookingService";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getRoom: vi.fn(),
  },
}));

vi.mock("@/features/confirm-booking/confirmBookingService", () => ({
  submitBooking: vi.fn(),
}));

describe("ConfirmBookingPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads the room, submits the booking, and navigates to the reminder screen", async () => {
    vi.mocked(fairroomApi.getRoom).mockResolvedValue({
      id: "room-1",
      roomCode: "RM-101",
      name: "Collaborative Study Suite 101",
      location: "Library, 2nd Floor - East Wing",
      capacity: 6,
      status: "operational",
      createdAt: "2026-04-10T10:00:00.000Z",
      amenities: [],
    });

    vi.mocked(submitBooking).mockResolvedValue({
      id: "booking-1",
      roomId: "room-1",
      roomCode: "RM-101",
      roomName: "Collaborative Study Suite 101",
      startsAt: "2026-04-10T09:00:00",
      endsAt: "2026-04-10T10:00:00",
      status: "active",
      checkedIn: false,
      createdAt: "2026-04-10T00:00:00.000Z",
      updatedAt: "2026-04-10T00:00:00.000Z",
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/bookings/confirm",
            state: { roomId: "room-1", date: "2026-04-10", slotHour: 9 },
          },
        ]}
      >
        <ConfirmBookingPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Collaborative Study Suite 101")).toBeInTheDocument();
    });

    await user.type(
      screen.getByLabelText("Purpose of Booking"),
      "Project review session",
    );
    const attendees = screen.getByLabelText("Expected Attendees");
    await user.clear(attendees);
    await user.type(attendees, "4");
    await user.click(screen.getByRole("button", { name: /confirm booking/i }));

    await waitFor(() => {
      expect(submitBooking).toHaveBeenCalledWith({
        roomId: "room-1",
        startsAt: "2026-04-10T09:00:00",
        endsAt: "2026-04-10T10:00:00",
        purpose: "Project review session",
        expectedAttendees: 4,
      });
    });

    expect(navigateMock).toHaveBeenCalledWith("/bookings/booking-1");
  });

  it("shows a room load error when the backend request fails", async () => {
    vi.mocked(fairroomApi.getRoom).mockRejectedValue(new Error("Room unavailable"));

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/bookings/confirm",
            state: { roomId: "room-1", date: "2026-04-10", slotHour: 9 },
          },
        ]}
      >
        <ConfirmBookingPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Room unavailable")).toBeInTheDocument();
    });
  });
});
