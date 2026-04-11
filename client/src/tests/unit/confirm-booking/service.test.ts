import { afterEach, describe, expect, it, vi } from "vitest";
import { fairroomApi } from "@/api/fairroomApi";
import { submitBooking } from "@/features/confirm-booking/confirmBookingService";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    createBooking: vi.fn(),
  },
}));

describe("confirm booking service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("surfaces backend validation messages when booking creation fails", async () => {
    vi.mocked(fairroomApi.createBooking).mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          error: {
            code: "BOOKING_CONFLICT",
            message: "The selected time range overlaps an existing active booking.",
          },
        },
      },
    });

    await expect(
      submitBooking({
        roomId: "room-1",
        startsAt: "2026-04-10T16:00:00",
        endsAt: "2026-04-10T17:00:00",
        purpose: "Project review session",
        expectedAttendees: 4,
      }),
    ).rejects.toThrow("The selected time range overlaps an existing active booking.");
  });
});
