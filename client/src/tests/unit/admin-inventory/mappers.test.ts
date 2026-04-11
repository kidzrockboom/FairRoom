import { describe, expect, it } from "vitest";

import type { AdminRoomResponse } from "@/api/contracts";

import {
  buildInventoryRoomCardViewModel,
  buildInventoryRoomFormValues,
  buildInventoryRoomPayload,
  buildInventorySummary,
} from "@/features/admin/inventory/adminInventoryMappers";

function buildRoom(overrides: Partial<AdminRoomResponse> = {}): AdminRoomResponse {
  return {
    id: "room-1",
    roomCode: "RM-401",
    name: "Conference Room A",
    location: "Block A, Floor 4",
    capacity: 20,
    status: "operational",
    usageNotes: "Quiet room for focused work",
    createdAt: "2026-04-10T00:00:00.000Z",
    amenities: [
      { id: "amenity-1", label: "Projector" },
      { id: "amenity-2", label: "Whiteboard" },
    ],
    ...overrides,
  };
}

describe("admin inventory mappers", () => {
  it("builds the inventory summary from backend rooms", () => {
    expect(
      buildInventorySummary([
        buildRoom(),
        buildRoom({
          id: "room-2",
          status: "disabled",
        }),
      ]),
    ).toEqual({
      totalSpaces: 2,
      activeNow: 1,
    });
  });

  it("maps a room to card view and form values", () => {
    expect(buildInventoryRoomCardViewModel(buildRoom())).toMatchObject({
      id: "room-1",
      roomCode: "RM-401",
      name: "Conference Room A",
      location: "Block A, Floor 4",
      capacity: 20,
      status: "operational",
      usageNotes: "Quiet room for focused work",
      amenityLabels: ["Projector", "Whiteboard"],
    });

    expect(buildInventoryRoomFormValues(buildRoom())).toEqual({
      roomCode: "RM-401",
      name: "Conference Room A",
      location: "Block A, Floor 4",
      capacity: 20,
      status: "operational",
      usageNotes: "Quiet room for focused work",
      amenityIds: ["amenity-1", "amenity-2"],
    });
  });

  it("normalizes form values into a room payload", () => {
    expect(
      buildInventoryRoomPayload({
        roomCode: "  RM-402 ",
        name: "  Seminar Room B ",
        location: "  Building 2, Floor 1 ",
        capacity: 30,
        status: "disabled",
        usageNotes: "  ",
        amenityIds: ["amenity-1"],
      }),
    ).toEqual({
      roomCode: "RM-402",
      name: "Seminar Room B",
      location: "Building 2, Floor 1",
      capacity: 30,
      status: "disabled",
      usageNotes: undefined,
    });
  });
});
