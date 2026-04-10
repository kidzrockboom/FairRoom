import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminStrikesPage from "../pages/dashboard/admin/AdminStrikesPage";

describe("AdminStrikesPage", () => {
  it("renders strike management layout", () => {
    render(<AdminStrikesPage />);

    expect(screen.getByText(/Student Directory/i)).toBeInTheDocument();
    expect(screen.getByText(/Strike Adjustment/i)).toBeInTheDocument();
  });
});
