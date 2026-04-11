import { afterEach, describe, expect, it, vi } from "vitest";

import { fairroomApi } from "@/api/fairroomApi";

import { loadAdminRoomUsage } from "@/features/admin/analytics/adminAnalyticsService";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAdminRoomUsage: vi.fn(),
  },
}));

describe("admin analytics service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads room usage analytics from the backend", async () => {
    vi.mocked(fairroomApi.getAdminRoomUsage).mockResolvedValue({
      groupBy: "room",
      startsAt: null,
      endsAt: null,
      items: [],
    });

    await expect(loadAdminRoomUsage()).resolves.toEqual({
      groupBy: "room",
      startsAt: null,
      endsAt: null,
      items: [],
    });

    expect(fairroomApi.getAdminRoomUsage).toHaveBeenCalledWith({
      groupBy: "room",
    });
  });
});
