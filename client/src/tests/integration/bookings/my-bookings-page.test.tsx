import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyBookingsPage from "@/pages/MyBookingsPage";
import { fairroomApi } from "@/api/fairroomApi";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getMyBookings: vi.fn(),
    cancelBooking: vi.fn(),
    updateBooking: vi.fn(),
  },
}));

describe("MyBookingsPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads bookings, switches tabs, updates page size, and cancels a booking", async () => {
    vi.mocked(fairroomApi.getMyBookings).mockImplementation(async (scope = "all", page = 1, pageSize = 12) => {
      if (scope === "active") {
        return {
          items: [
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
          ],
          page,
          pageSize,
          total: 1,
        };
      }

      return {
        items: [
          {
            id: "booking-2",
            roomId: "room-2",
            roomCode: "RM-202",
            roomName: "Silent Study Pod 12",
            startsAt: "2026-03-10T09:00:00.000Z",
            endsAt: "2026-03-10T10:00:00.000Z",
            status: "completed",
            checkedIn: true,
            createdAt: "2026-03-10T00:00:00.000Z",
            updatedAt: "2026-03-10T00:00:00.000Z",
          },
          {
            id: "booking-3",
            roomId: "room-3",
            roomCode: "RM-303",
            roomName: "Meeting Room 09",
            startsAt: "2026-03-11T09:00:00.000Z",
            endsAt: "2026-03-11T10:00:00.000Z",
            status: "cancelled",
            checkedIn: false,
            createdAt: "2026-03-11T00:00:00.000Z",
            updatedAt: "2026-03-11T00:00:00.000Z",
          },
        ],
        page,
        pageSize,
        total: 2,
      };
    });

    vi.mocked(fairroomApi.cancelBooking).mockResolvedValue({
      id: "booking-1",
      roomId: "room-1",
      roomCode: "RM-101",
      roomName: "Collaborative Study Suite 101",
      startsAt: "2026-04-10T09:00:00.000Z",
      endsAt: "2026-04-10T10:00:00.000Z",
      status: "cancelled",
      checkedIn: false,
      createdAt: "2026-04-10T00:00:00.000Z",
      updatedAt: "2026-04-10T00:00:00.000Z",
    });

    vi.mocked(fairroomApi.updateBooking).mockResolvedValue({
      id: "booking-1",
      roomId: "room-1",
      roomCode: "RM-101",
      roomName: "Collaborative Study Suite 101",
      startsAt: "2026-04-10T10:00:00.000Z",
      endsAt: "2026-04-10T11:00:00.000Z",
      status: "active",
      checkedIn: false,
      createdAt: "2026-04-10T00:00:00.000Z",
      updatedAt: "2026-04-10T00:00:00.000Z",
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/bookings"]}>
        <MyBookingsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Upcoming (1)" })).toBeInTheDocument();
    });

    expect(fairroomApi.getMyBookings).toHaveBeenCalledWith("active", 1, 12);
    expect(fairroomApi.getMyBookings).toHaveBeenCalledWith("past", 1, 12);
    expect(fairroomApi.getMyBookings).toHaveBeenCalledWith("all", 1, 1000);
    expect(screen.getByText("Collaborative Study Suite 101")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Cancelled (1)" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "History (1)" }));
    expect(screen.getByText("Silent Study Pod 12")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Upcoming (1)" }));
    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.clear(screen.getByLabelText("Start time"));
    await user.type(screen.getByLabelText("Start time"), "2026-04-10T10:00");
    await user.clear(screen.getByLabelText("End time"));
    await user.type(screen.getByLabelText("End time"), "2026-04-10T11:00");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(fairroomApi.updateBooking).toHaveBeenCalledWith("booking-1", {
        startsAt: "2026-04-10T10:00:00",
        endsAt: "2026-04-10T11:00:00",
      });
    });

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    await user.click(screen.getByRole("button", { name: "Cancel booking" }));

    await waitFor(() => {
      expect(fairroomApi.cancelBooking).toHaveBeenCalledWith("booking-1", {});
    });

    await user.click(screen.getByRole("tab", { name: "Cancelled (1)" }));
    expect(screen.getByText("Meeting Room 09")).toBeInTheDocument();

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("24"));

    await waitFor(() => {
      expect(fairroomApi.getMyBookings).toHaveBeenCalledWith("active", 1, 24);
      expect(fairroomApi.getMyBookings).toHaveBeenCalledWith("past", 1, 24);
    });
  });
});
