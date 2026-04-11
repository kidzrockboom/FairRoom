import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RemindersPopover from "@/features/reminders/components/RemindersPopover";
import { fairroomApi } from "@/api/fairroomApi";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getMyReminders: vi.fn(),
  },
}));

describe("RemindersPopover", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("loads reminders when the bell is opened and renders them", async () => {
    vi.mocked(fairroomApi.getMyReminders).mockResolvedValue([
      {
        id: "reminder-1",
        bookingId: "booking-1",
        channel: "email",
        scheduledFor: "2026-04-10T18:00:00.000Z",
        sentAt: "2026-04-10T18:05:00.000Z",
        status: "delivered",
        failureReason: "",
        createdAt: "2026-04-10T17:59:00.000Z",
      },
    ]);

    render(
      <MemoryRouter>
        <RemindersPopover />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getAllByRole("button", { name: "Open reminders" })[0]);

    await waitFor(() => {
      expect(screen.getByText("Email reminder")).toBeInTheDocument();
    });

    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View bookings" })).toBeInTheDocument();
  });

  it("shows an empty state when there are no reminders", async () => {
    vi.mocked(fairroomApi.getMyReminders).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <RemindersPopover />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getAllByRole("button", { name: "Open reminders" })[0]);

    await waitFor(() => {
      expect(screen.getByText("No reminders yet.")).toBeInTheDocument();
    });
  });
});
