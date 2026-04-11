import { describe, expect, it } from "vitest";

import type { AdminRoomUsageResponse } from "@/api/contracts";

import { buildAdminAnalyticsViewModel } from "@/features/admin/analytics/adminAnalyticsMappers";

function buildUsageResponse(overrides: Partial<AdminRoomUsageResponse> = {}): AdminRoomUsageResponse {
  return {
    groupBy: "room",
    startsAt: "2026-04-01T00:00:00.000Z",
    endsAt: "2026-04-30T23:59:59.000Z",
    items: [
      { key: "Room 412", totalBookings: 24, totalHours: 210, noShowCount: 2 },
      { key: "Room 205", totalBookings: 18, totalHours: 190, noShowCount: 1 },
      { key: "Room 101", totalBookings: 10, totalHours: 145, noShowCount: 0 },
    ],
    ...overrides,
  };
}

describe("admin analytics mappers", () => {
  it("derives kpis and a chart from backend room usage data", () => {
    const viewModel = buildAdminAnalyticsViewModel(buildUsageResponse());

    expect(viewModel.hasData).toBe(true);
    expect(viewModel.kpis).toHaveLength(3);
    expect(viewModel.kpis[0]).toMatchObject({
      label: "Most Popular Room",
      value: "Room 412",
      note: "24 bookings this period",
    });
    expect(viewModel.kpis[1]).toMatchObject({
      label: "Avg Booking Duration",
      value: "10.5 Hours",
    });
    expect(viewModel.kpis[2]).toMatchObject({
      label: "No-Show Rate",
      value: "5.8%",
    });
    expect(viewModel.chart.groupLabel).toBe("Group by: room");
    expect(viewModel.chart.bars).toEqual([
      { room: "Room 412", hours: 210 },
      { room: "Room 205", hours: 190 },
      { room: "Room 101", hours: 145 },
    ]);
    expect(viewModel.chart.yAxis[0]).toBeGreaterThan(0);
  });

  it("handles empty room usage data", () => {
    const viewModel = buildAdminAnalyticsViewModel(buildUsageResponse({ items: [] }));

    expect(viewModel.hasData).toBe(false);
    expect(viewModel.kpis[0]).toMatchObject({
      value: "No data",
    });
    expect(viewModel.chart.bars).toEqual([]);
  });
});
