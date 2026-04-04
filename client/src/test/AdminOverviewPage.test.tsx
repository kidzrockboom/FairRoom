import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminOverviewPage from "../pages/dashboard/admin/AdminOverviewPage";

describe("AdminOverviewPage", () => {
  it("renders admin overview table", () => {
    render(<AdminOverviewPage />);

    expect(screen.getByText(/Bookings Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/User Details/i)).toBeInTheDocument();
  });
});
