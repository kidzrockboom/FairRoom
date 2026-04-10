import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import AdminBookingsPage from "@/pages/admin/AdminBookingsPage";
import { fairroomApi } from "@/api/fairroomApi";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAdminBookings: vi.fn(),
  },
}));

type BookingStatus = "active" | "cancelled" | "completed" | "no_show";

function buildBooking(index: number) {
  return {
    id: `booking-${index + 1}`,
    user: {
      id: `user-${index + 1}`,
      fullName: "Michael Chen",
    },
    room: {
      id: `room-${index + 1}`,
      roomCode: `RM-${200 + index + 1}`,
      name: `Study Room ${index + 1}`,
      location: `Campus ${index % 3 === 0 ? "North" : index % 3 === 1 ? "South" : "East"}`,
    },
    startsAt: "2026-04-10T08:00:00",
    endsAt: "2026-04-10T09:00:00",
    status: "cancelled" as BookingStatus,
    checkedIn: true,
    createdAt: "2026-04-10T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
  };
}

const allBookings = Array.from({ length: 36 }, (_, index) => buildBooking(index));

function filterBookings(params: Record<string, unknown> = {}) {
  const search = typeof params.search === "string" ? params.search.trim().toLowerCase() : "";
  const status = typeof params.status === "string" ? params.status : "";
  const startsAt = typeof params.startsAt === "string" ? params.startsAt.slice(0, 10) : "";
  const endsAt = typeof params.endsAt === "string" ? params.endsAt.slice(0, 10) : "";
  const page = typeof params.page === "number" ? params.page : 1;
  const pageSize = typeof params.pageSize === "number" ? params.pageSize : 12;

  const filtered = allBookings.filter((booking) => {
    const matchesSearch =
      !search ||
      booking.user.fullName.toLowerCase().includes(search) ||
      booking.room.name.toLowerCase().includes(search) ||
      booking.room.roomCode.toLowerCase().includes(search);
    const matchesStatus = !status || booking.status === status;
    const bookingDate = booking.startsAt.slice(0, 10);
    const matchesDate =
      (!startsAt || bookingDate >= startsAt) &&
      (!endsAt || bookingDate <= endsAt);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    page,
    pageSize,
    total: filtered.length,
  };
}

describe("AdminBookingsPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders backend bookings and keeps filters aligned with API params", async () => {
    vi.mocked(fairroomApi.getAdminBookings).mockImplementation(async (params = {}) =>
      filterBookings(params as Record<string, unknown>),
    );

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/admin/bookings"]}>
        <Routes>
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fairroomApi.getAdminBookings).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 12,
        }),
      );
    });

    expect(screen.getByRole("heading", { name: "Bookings Overview" })).toBeInTheDocument();
    expect(screen.getAllByText("Michael Chen").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Study Room 1").length).toBeGreaterThan(0);
    expect(screen.getByText("ID: RM-201")).toBeInTheDocument();
    expect(screen.getAllByText("Campus North").length).toBeGreaterThan(0);
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("Pro Tip")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Export CSV" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "New Booking" })).not.toBeInTheDocument();
    expect(screen.queryByText("System Settings")).not.toBeInTheDocument();
    expect(screen.queryByText("4 Pending")).not.toBeInTheDocument();
    expect(screen.getAllByLabelText("Rows per page")).toHaveLength(1);

    const searchInput = screen.getByLabelText("Search user or room");
    fireEvent.change(searchInput, { target: { value: "Michael" } });

    await waitFor(() => {
      expect(fairroomApi.getAdminBookings).toHaveBeenLastCalledWith(
        expect.objectContaining({
          search: "Michael",
          page: 1,
          pageSize: 12,
        }),
      );
    });

    expect(screen.getAllByText("Michael Chen").length).toBeGreaterThan(0);

    await user.click(screen.getByLabelText("Booking status"));
    await user.click(await screen.findByRole("option", { name: "Cancelled" }));

    await waitFor(() => {
      expect(fairroomApi.getAdminBookings).toHaveBeenLastCalledWith(
        expect.objectContaining({
          search: "Michael",
          status: "cancelled",
          page: 1,
          pageSize: 12,
        }),
      );
    });

    expect(screen.getAllByText("Michael Chen").length).toBeGreaterThan(0);

    const bookingDate = screen.getByLabelText("Booking date");
    fireEvent.change(bookingDate, { target: { value: "2026-04-10" } });

    await waitFor(() => {
      expect(fairroomApi.getAdminBookings).toHaveBeenLastCalledWith(
        expect.objectContaining({
          search: "Michael",
          status: "cancelled",
          startsAt: "2026-04-10T00:00:00",
          endsAt: "2026-04-10T23:59:59",
          page: 1,
          pageSize: 12,
        }),
      );
    });

    await user.selectOptions(screen.getByLabelText("Rows per page"), "24");

    await waitFor(() => {
      expect(fairroomApi.getAdminBookings).toHaveBeenLastCalledWith(
        expect.objectContaining({
          search: "Michael",
          status: "cancelled",
          startsAt: "2026-04-10T00:00:00",
          endsAt: "2026-04-10T23:59:59",
          page: 1,
          pageSize: 24,
        }),
      );
    });

    await user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(fairroomApi.getAdminBookings).toHaveBeenLastCalledWith(
        expect.objectContaining({
          search: "Michael",
          status: "cancelled",
          startsAt: "2026-04-10T00:00:00",
          endsAt: "2026-04-10T23:59:59",
          page: 2,
          pageSize: 24,
        }),
      );
    });
  });
});
