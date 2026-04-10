import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AccountStatusPage from "../pages/dashboard/AccountStatusPage";

vi.mock("../api/fairroomApi", () => ({
  fairroomApi: {
    getAccountStatus: vi.fn().mockResolvedValue({
      activeStrikes: 1,
      bookingEligible: true,
      accountState: "good",
    }),
    getAccountActivities: vi.fn().mockResolvedValue({
      items: [
        {
          id: "act_1",
          type: "strike_recorded",
          title: "Strike Added",
          description: "No-show for Room 402",
          occurredAt: new Date().toISOString(),
          status: "incident",
          sourceEntityType: "strike",
          sourceEntityId: "str_1",
        },
      ],
    }),
  },
}));

describe("AccountStatusPage", () => {
  it("renders account standing and activity", async () => {
    render(
      <MemoryRouter>
        <AccountStatusPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading account status/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Account Health/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/ACTIVE STRIKES/i)).toBeInTheDocument();
    expect(screen.getByText(/Strike Added/i)).toBeInTheDocument();
  });
});
