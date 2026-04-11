import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { fairroomApi } from "@/api/fairroomApi";
import AdminAnalyticsPage from "@/pages/admin/AdminAnalyticsPage";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAdminRoomUsage: vi.fn(),
  },
}));

describe("AdminAnalyticsPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders analytics derived from backend room usage data", async () => {
    vi.mocked(fairroomApi.getAdminRoomUsage).mockResolvedValue({
      groupBy: "room",
      startsAt: "2026-04-01T00:00:00.000Z",
      endsAt: "2026-04-30T23:59:59.000Z",
      items: [
        { key: "Room 412", totalBookings: 24, totalHours: 210, noShowCount: 2 },
        { key: "Room 205", totalBookings: 18, totalHours: 190, noShowCount: 1 },
        { key: "Room 101", totalBookings: 10, totalHours: 145, noShowCount: 0 },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/admin/analytics"]}>
        <Routes>
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Room Usage Review" })).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /Filters/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Export PDF/i })).not.toBeInTheDocument();
    expect(screen.getByText("Most Popular Room")).toBeInTheDocument();
    expect(screen.getAllByText("Room 412")[0]).toBeInTheDocument();
    expect(screen.getByText("Usage Distribution")).toBeInTheDocument();
    expect(screen.getByLabelText("Room 412 210 hours")).toBeInTheDocument();
  });

  it("shows an empty state when analytics data is missing", async () => {
    vi.mocked(fairroomApi.getAdminRoomUsage).mockResolvedValue({
      groupBy: "room",
      startsAt: null,
      endsAt: null,
      items: [],
    });

    render(
      <MemoryRouter initialEntries={["/admin/analytics"]}>
        <Routes>
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("No analytics data is available yet")).toBeInTheDocument();
    });
  });
});
