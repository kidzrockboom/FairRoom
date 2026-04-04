import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RoomDetailsPage from "../pages/dashboard/RoomDetailsPage";

vi.mock("../api/fairroomApi", () => ({
  fairroomApi: {
    getRoom: vi.fn().mockResolvedValue({
      id: "room_1",
      roomCode: "RM-204",
      name: "Collaboration Lab 204",
      location: "Library",
      capacity: 6,
      isActive: true,
      createdAt: new Date().toISOString(),
    }),
    getRoomAvailability: vi.fn().mockResolvedValue({
      roomId: "room_1",
      requestedStartsAt: new Date().toISOString(),
      requestedEndsAt: new Date().toISOString(),
      windows: [
        {
          startsAt: new Date().toISOString(),
          endsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          status: "available",
        },
      ],
    }),
    createBooking: vi.fn().mockResolvedValue({}),
  },
}));

describe("RoomDetailsPage", () => {
  it("renders room details and availability windows", async () => {
    render(
      <MemoryRouter initialEntries={["/app/rooms/room_1"]}>
        <Routes>
          <Route path="/app/rooms/:roomId" element={<RoomDetailsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Collaboration Lab 204/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Room Availability/i)).toBeInTheDocument();
  });
});
