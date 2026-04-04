import { describe, expect, it, vi } from "vitest";

vi.mock("axios", () => {
  const get = vi.fn().mockRejectedValue(new Error("Network error"));
  const post = vi.fn().mockRejectedValue(new Error("Network error"));
  return {
    default: {
      create: () => ({
        get,
        post,
      }),
    },
  };
});

import { fairroomApi } from "../api/fairroomApi";

describe("fairroomApi fallback behavior", () => {
  it("returns derived account status when API is unavailable", async () => {
    const status = await fairroomApi.getAccountStatus();

    expect(status.activeStrikes).toBeTypeOf("number");
    expect(status.accountState).toMatch(/good|warned|restricted/);
    expect(status.bookingEligible).toBe(true);
  });

  it("returns bookings from fallback when API is unavailable", async () => {
    const result = await fairroomApi.getMyBookings("all");

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items[0]).toHaveProperty("startsAt");
    expect(result.items[0]).toHaveProperty("endsAt");
  });
});
