import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { AdminRoomResponse } from "@/api/contracts";
import { fairroomApi } from "@/api/fairroomApi";
import AdminInventoryPage from "@/pages/admin/AdminInventoryPage";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAdminRooms: vi.fn(),
    getAdminAmenities: vi.fn(),
    createAdminRoom: vi.fn(),
    updateAdminRoom: vi.fn(),
    setAdminRoomAmenities: vi.fn(),
    createAdminAmenity: vi.fn(),
  },
}));

function buildRoom(overrides: Partial<AdminRoomResponse> = {}): AdminRoomResponse {
  return {
    id: "room-1",
    roomCode: "RM-401",
    name: "Collaborative Suite",
    location: "Block A, Floor 4",
    capacity: 16,
    status: "operational",
    usageNotes: "Quiet group study room",
    createdAt: "2026-04-10T00:00:00.000Z",
    amenities: [
      { id: "amenity-1", label: "Projector" },
      { id: "amenity-2", label: "Whiteboard" },
    ],
    ...overrides,
  };
}

describe("AdminInventoryPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads backend inventory, adds a room, and toggles room status", async () => {
    const rooms: AdminRoomResponse[] = [buildRoom()];

    vi.mocked(fairroomApi.getAdminRooms).mockResolvedValue({
      items: rooms,
      total: rooms.length,
    });
    vi.mocked(fairroomApi.getAdminAmenities).mockResolvedValue({
      items: [
        { id: "amenity-1", label: "Projector" },
        { id: "amenity-2", label: "Whiteboard" },
      ],
      total: 2,
    });
    vi.mocked(fairroomApi.createAdminAmenity).mockResolvedValue({
      id: "amenity-3",
      label: "Video Conferencing",
    });
    vi.mocked(fairroomApi.createAdminRoom).mockResolvedValue({
      id: "room-2",
      roomCode: "RM-402",
      name: "Seminar Room B",
      location: "Block B, Floor 2",
      capacity: 24,
      status: "operational",
      usageNotes: "Freshly added",
      createdAt: "2026-04-10T00:00:00.000Z",
      amenities: [],
    });
    vi.mocked(fairroomApi.setAdminRoomAmenities).mockResolvedValue({
      id: "room-2",
      roomCode: "RM-402",
      name: "Seminar Room B",
      location: "Block B, Floor 2",
      capacity: 24,
      status: "operational",
      usageNotes: "Freshly added",
      createdAt: "2026-04-10T00:00:00.000Z",
      amenities: [{ id: "amenity-3", label: "Video Conferencing" }],
    });
    vi.mocked(fairroomApi.updateAdminRoom).mockImplementation(async (roomId, payload) => {
      if (roomId === "room-1") {
        return {
          ...buildRoom({
            status: (payload.status ?? "operational") as "operational" | "disabled",
          }),
          status: (payload.status ?? "operational") as "operational" | "disabled",
        };
      }

      return {
        id: roomId,
        roomCode: "RM-402",
        name: "Seminar Room B",
        location: "Block B, Floor 2",
        capacity: 24,
        status: (payload.status ?? "operational") as "operational" | "disabled",
        usageNotes: "Freshly added",
        createdAt: "2026-04-10T00:00:00.000Z",
        amenities: [],
      };
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/admin/inventory"]}>
        <Routes>
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Room Inventory" })).toBeInTheDocument();
    });

    expect(screen.getByText("Total Spaces")).toBeInTheDocument();
    expect(screen.getByText("Active Now")).toBeInTheDocument();
    expect(screen.getByText("Collaborative Suite")).toBeInTheDocument();
    expect(screen.getByText("Projector")).toBeInTheDocument();
    expect(screen.getByText("Whiteboard")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Add New Room/i }));

    const sheet = await screen.findByRole("heading", { name: "Register New Room" });
    expect(sheet).toBeInTheDocument();

    const dialog = (sheet.closest("[data-slot='sheet-content']") ?? document.body) as HTMLElement;
    const sheetScope = within(dialog);

    await user.type(sheetScope.getByLabelText("Room Code"), "RM-402");
    await user.type(sheetScope.getByLabelText("Room Name"), "Seminar Room B");
    await user.type(sheetScope.getByLabelText("Location"), "Block B, Floor 2");
    await user.clear(sheetScope.getByLabelText("Capacity"));
    await user.type(sheetScope.getByLabelText("Capacity"), "24");
    await user.type(sheetScope.getByLabelText("Usage Notes"), "Freshly added");
    await user.type(sheetScope.getByLabelText("New amenity"), "Video Conferencing");
    await user.click(sheetScope.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(fairroomApi.createAdminAmenity).toHaveBeenCalledWith({
        label: "Video Conferencing",
      });
    });

    await user.click(sheetScope.getByRole("button", { name: "Create Room" }));

    await waitFor(() => {
      expect(fairroomApi.createAdminRoom).toHaveBeenCalledWith({
        roomCode: "RM-402",
        name: "Seminar Room B",
        location: "Block B, Floor 2",
        capacity: 24,
        status: "operational",
        usageNotes: "Freshly added",
      });
    });

    await waitFor(() => {
      expect(fairroomApi.setAdminRoomAmenities).toHaveBeenCalledWith("room-2", {
        amenityIds: ["amenity-3"],
      });
    });

    await user.click(screen.getByRole("button", { name: /Disable Room/i }));

    await waitFor(() => {
      expect(fairroomApi.updateAdminRoom).toHaveBeenCalledWith(
        "room-1",
        expect.objectContaining({ status: "disabled" }),
      );
    });
  });

  it("opens the edit sheet with backend values", async () => {
    vi.mocked(fairroomApi.getAdminRooms).mockResolvedValue({
      items: [buildRoom()],
      total: 1,
    });
    vi.mocked(fairroomApi.getAdminAmenities).mockResolvedValue({
      items: [{ id: "amenity-1", label: "Projector" }],
      total: 1,
    });

    render(
      <MemoryRouter initialEntries={["/admin/inventory"]}>
        <Routes>
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Collaborative Suite")).toBeInTheDocument();
    });

    await userEvent.click(screen.getAllByRole("button", { name: "Edit Collaborative Suite" })[0]);

    const heading = await screen.findByRole("heading", { name: "Edit Room" });
    expect(heading).toBeInTheDocument();
    expect(screen.getByDisplayValue("RM-401")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Collaborative Suite")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Block A, Floor 4")).toBeInTheDocument();
  });
});
