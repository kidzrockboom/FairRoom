import { describe, expect, it } from "vitest";
import {
  formatReminderChannel,
  formatReminderDate,
  formatReminderStatus,
  getReminderDetail,
  getReminderStatusBadgeClassName,
  getReminderSummary,
} from "@/features/reminders/remindersMappers";

describe("reminders mappers", () => {
  it("maps reminder channels and statuses to readable labels", () => {
    expect(formatReminderChannel("email")).toBe("Email");
    expect(formatReminderChannel("push")).toBe("Push");
    expect(formatReminderChannel("sms")).toBe("SMS");

    expect(formatReminderStatus("scheduled")).toBe("Scheduled");
    expect(formatReminderStatus("delivered")).toBe("Delivered");
    expect(formatReminderStatus("failed")).toBe("Failed");
  });

  it("formats reminder summaries and details", () => {
    expect(
      getReminderSummary({
        id: "reminder-1",
        bookingId: "booking-1",
        channel: "email",
        scheduledFor: "2026-04-10T18:00:00.000Z",
        sentAt: "2026-04-10T18:05:00.000Z",
        status: "scheduled",
        failureReason: "",
        createdAt: "2026-04-10T17:59:00.000Z",
      }),
    ).toContain("Scheduled for");

    expect(
      getReminderSummary({
        id: "reminder-2",
        bookingId: "booking-2",
        channel: "push",
        scheduledFor: "2026-04-10T18:00:00.000Z",
        sentAt: "2026-04-10T18:05:00.000Z",
        status: "delivered",
        failureReason: "",
        createdAt: "2026-04-10T17:59:00.000Z",
      }),
    ).toContain("Delivered at");

    expect(
      getReminderDetail({
        id: "reminder-3",
        bookingId: "booking-3",
        channel: "sms",
        scheduledFor: "2026-04-10T18:00:00.000Z",
        sentAt: "2026-04-10T18:05:00.000Z",
        status: "failed",
        failureReason: "Carrier unavailable",
        createdAt: "2026-04-10T17:59:00.000Z",
      }),
    ).toBe("Carrier unavailable");

    expect(formatReminderDate("2026-04-10T18:00:00.000Z")).toBe("Fri 10 Apr, 18:00");
    expect(getReminderStatusBadgeClassName("failed")).toContain("red");
  });
});
