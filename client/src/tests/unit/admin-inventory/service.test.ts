import { afterEach, describe, expect, it, vi } from "vitest";

import { fairroomApi } from "@/api/fairroomApi";

import {
  createAdminAmenity,
  loadAdminInventory,
  saveAdminRoom,
  toggleAdminRoomStatus,
} from "@/features/admin/inventory/adminInventoryService";

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

describe("admin inventory service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads rooms and amenities together", async () => {
    vi.mocked(fairroomApi.getAdminRooms).mockResolvedValue({
      items: [],
      total: 0,
    });
    vi.mocked(fairroomApi.getAdminAmenities).mockResolvedValue({
      items: [{ id: "amenity-1", label: "Projector" }],
      total: 1,
    });

    await expect(loadAdminInventory()).resolves.toEqual({
      rooms: [],
      amenities: [{ id: "amenity-1", label: "Projector" }],
    });
  });

  it("saves a room then syncs amenity assignments", async () => {
    vi.mocked(fairroomApi.createAdminRoom).mockResolvedValue({
      id: "room-1",
      roomCode: "RM-402",
      name: "Seminar Room B",
      location: "Building 2, Floor 1",
      capacity: 24,
      status: "operational",
      usageNotes: "",
      createdAt: "2026-04-10T00:00:00.000Z",
      amenities: [],
    });
    vi.mocked(fairroomApi.setAdminRoomAmenities).mockResolvedValue({
      id: "room-1",
      roomCode: "RM-402",
      name: "Seminar Room B",
      location: "Building 2, Floor 1",
      capacity: 24,
      status: "operational",
      usageNotes: "",
      createdAt: "2026-04-10T00:00:00.000Z",
      amenities: [{ id: "amenity-1", label: "Projector" }],
    });

    await expect(
      saveAdminRoom(null, {
        roomCode: " RM-402 ",
        name: " Seminar Room B ",
        location: " Building 2, Floor 1 ",
        capacity: 24,
        status: "operational",
        usageNotes: "",
        amenityIds: ["amenity-1"],
      }),
    ).resolves.toMatchObject({
      id: "room-1",
      amenities: [{ id: "amenity-1", label: "Projector" }],
    });

    expect(fairroomApi.createAdminRoom).toHaveBeenCalledWith({
      roomCode: "RM-402",
      name: "Seminar Room B",
      location: "Building 2, Floor 1",
      capacity: 24,
      status: "operational",
      usageNotes: undefined,
    });
    expect(fairroomApi.setAdminRoomAmenities).toHaveBeenCalledWith("room-1", {
      amenityIds: ["amenity-1"],
    });
  });

  it("toggles room status and creates amenities", async () => {
    vi.mocked(fairroomApi.updateAdminRoom).mockResolvedValue({
      id: "room-1",
      roomCode: "RM-402",
      name: "Seminar Room B",
      location: "Building 2, Floor 1",
      capacity: 24,
      status: "disabled",
      usageNotes: "",
      createdAt: "2026-04-10T00:00:00.000Z",
      amenities: [],
    });
    vi.mocked(fairroomApi.createAdminAmenity).mockResolvedValue({
      id: "amenity-2",
      label: "Video Conferencing",
    });

    await expect(
      toggleAdminRoomStatus({
        id: "room-1",
        roomCode: "RM-402",
        name: "Seminar Room B",
        location: "Building 2, Floor 1",
        capacity: 24,
        status: "operational",
        usageNotes: "",
        createdAt: "2026-04-10T00:00:00.000Z",
        amenities: [],
      }),
    ).resolves.toMatchObject({
      status: "disabled",
    });

    await expect(createAdminAmenity("Video Conferencing")).resolves.toEqual({
      id: "amenity-2",
      label: "Video Conferencing",
    });
  });
});
