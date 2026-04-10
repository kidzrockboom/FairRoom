import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchRoomsPage from "../pages/dashboard/SearchRoomsPage";

vi.mock("../api/fairroomApi", () => ({
  fairroomApi: {
    searchRooms: vi.fn().mockResolvedValue({
      items: [
        {
          id: "room_1",
          roomCode: "RM-204",
          name: "Collaboration Lab 204",
          location: "Library",
          capacity: 6,
          isAvailableForRequestedRange: true,
        },
      ],
      page: 1,
      pageSize: 10,
      total: 1,
    }),
  },
}));

describe("SearchRoomsPage", () => {
  it("renders search results from the API layer", async () => {
    render(
      <MemoryRouter>
        <SearchRoomsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Collaboration Lab 204/i)).toBeInTheDocument();
    });
  });
});
