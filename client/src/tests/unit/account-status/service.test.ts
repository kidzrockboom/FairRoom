import { afterEach, describe, expect, it, vi } from "vitest";

import { fairroomApi } from "@/api/fairroomApi";

import { loadAccountStatusOverview } from "@/features/account-status/accountStatusService";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAccountStatus: vi.fn(),
    getAccountActivities: vi.fn(),
  },
}));

describe("account status service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads account status and falls back to empty activities when needed", async () => {
    vi.mocked(fairroomApi.getAccountStatus).mockResolvedValue({
      activeStrikes: 1,
      bookingEligible: true,
      accountState: "good",
    });
    vi.mocked(fairroomApi.getAccountActivities).mockRejectedValue(new Error("Unavailable"));

    await expect(loadAccountStatusOverview()).resolves.toEqual({
      accountStatus: {
        activeStrikes: 1,
        bookingEligible: true,
        accountState: "good",
      },
      accountActivities: [],
    });
  });

  it("normalizes wrapped activity payloads into a flat list", async () => {
    vi.mocked(fairroomApi.getAccountStatus).mockResolvedValue({
      activeStrikes: 2,
      bookingEligible: false,
      accountState: "warned",
    });
    vi.mocked(fairroomApi.getAccountActivities).mockResolvedValue({
      items: [
        {
          id: "activity-1",
          type: "strike_recorded",
          title: "Strike recorded",
          description: "A strike was added.",
          occurredAt: "2026-04-10T18:56:42.736753+00:00",
          status: "incident",
          sourceEntityType: "strike",
          sourceEntityId: "strike-1",
        },
        {
          id: "activity-2",
          type: "booking_created",
          title: "Booking confirmed",
          description: "Room RM-Q101 booked for 2026-04-10 16:00 to 17:00.",
          occurredAt: "2026-04-10T16:17:21.834387+00:00",
          status: "completed",
          sourceEntityType: "booking",
          sourceEntityId: "booking-1",
        },
      ],
    } as never);

    await expect(loadAccountStatusOverview()).resolves.toEqual({
      accountStatus: {
        activeStrikes: 2,
        bookingEligible: false,
        accountState: "warned",
      },
      accountActivities: [
        {
          id: "activity-1",
          type: "strike_recorded",
          title: "Strike recorded",
          description: "A strike was added.",
          occurredAt: "2026-04-10T18:56:42.736753+00:00",
          status: "incident",
          sourceEntityType: "strike",
          sourceEntityId: "strike-1",
        },
        {
          id: "activity-2",
          type: "booking_created",
          title: "Booking confirmed",
          description: "Room RM-Q101 booked for 2026-04-10 16:00 to 17:00.",
          occurredAt: "2026-04-10T16:17:21.834387+00:00",
          status: "completed",
          sourceEntityType: "booking",
          sourceEntityId: "booking-1",
        },
      ],
    });
  });
});
