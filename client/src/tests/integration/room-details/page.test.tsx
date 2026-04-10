import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { Route, Routes, MemoryRouter } from "react-router-dom";
import RoomDetailsPage from "@/pages/RoomDetailsPage";
import { fairroomApi } from "@/api/fairroomApi";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getRoom: vi.fn(),
    getRoomBookings: vi.fn(),
  },
}));

describe("RoomDetailsPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders room details from the backend payload and links to booking confirmation", async () => {
    vi.mocked(fairroomApi.getRoom).mockResolvedValue({
      id: "room-1",
      roomCode: "RM-101",
      name: "Collaborative Study Suite 101",
      location: "Library, 2nd Floor - East Wing",
      capacity: 6,
      isActive: true,
      status: "operational",
      usageNotes: "Quiet workspace for group study",
      createdAt: "2026-04-10T10:00:00.000Z",
      amenities: [
        { id: "amenity-1", label: "Projector" },
        { id: "amenity-2", label: "Whiteboard" },
      ],
    });
    vi.mocked(fairroomApi.getRoomBookings).mockResolvedValue({
      items: [
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
      ],
    });

    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/rooms/room-1"]}>
        <Routes>
          <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Collaborative Study Suite 101" })).toBeInTheDocument();
    });

    expect(screen.getByText("Library, 2nd Floor - East Wing")).toBeInTheDocument();
    expect(screen.getByText("Projector")).toBeInTheDocument();
    expect(screen.getByText("Whiteboard")).toBeInTheDocument();
    expect(screen.getByText("Room Photography Placeholder")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "02:00 PMAvailable" }));
    expect(screen.getByRole("link", { name: "Book This Room" })).toHaveAttribute("href", "/bookings/confirm");
  });

  it("shows a room not found state when the backend returns an error", async () => {
    vi.mocked(fairroomApi.getRoom).mockRejectedValue(new Error("Room not found"));
    vi.mocked(fairroomApi.getRoomBookings).mockResolvedValue({ items: [] });

    render(
      <MemoryRouter initialEntries={["/rooms/room-1"]}>
        <Routes>
          <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Room not found")).toBeInTheDocument();
    });
  });
});
