import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookingReminderPage from "@/pages/BookingReminderPage";

describe("BookingReminderPage", () => {
  it("renders the reminder details and actions", () => {
    render(
      <MemoryRouter>
        <BookingReminderPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Booking Reminder" })).toBeInTheDocument();
    expect(screen.getByText("Study Pod 04")).toBeInTheDocument();
    expect(screen.getByText("30 minutes")).toBeInTheDocument();
    expect(screen.getByText("Notification History")).toBeInTheDocument();

    const viewDetails = screen.getByRole("link", { name: "View Details" });
    expect(viewDetails).toHaveAttribute("href", "/rooms/study-pod-04");
  });
});
