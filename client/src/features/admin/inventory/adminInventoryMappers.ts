import type {
  AdminRoomResponse,
  AmenityResponse,
  CreateRoomRequest,
  RoomStatus,
} from "@/api/contracts";

import type { InventoryRoomFormValues } from "./schemas";

export type InventorySummary = {
  totalSpaces: number;
  activeNow: number;
};

export type InventoryRoomCardViewModel = {
  id: string;
  roomCode: string;
  name: string;
  location: string;
  capacity: number;
  status: RoomStatus;
  usageNotes: string;
  amenityLabels: string[];
};

export type InventoryAmenityOption = AmenityResponse;

export function buildInventorySummary(rooms: AdminRoomResponse[]): InventorySummary {
  return {
    totalSpaces: rooms.length,
    activeNow: rooms.filter((room) => room.status === "operational").length,
  };
}

export function buildInventoryRoomCardViewModel(room: AdminRoomResponse): InventoryRoomCardViewModel {
  return {
    id: room.id,
    roomCode: room.roomCode,
    name: room.name,
    location: room.location,
    capacity: room.capacity,
    status: room.status,
    usageNotes: room.usageNotes,
    amenityLabels: room.amenities.map((amenity) => amenity.label),
  };
}

export function buildInventoryRoomFormValues(
  room?: AdminRoomResponse | null,
): InventoryRoomFormValues {
  if (!room) {
    return {
      roomCode: "",
      name: "",
      location: "",
      capacity: 1,
      status: "operational",
      usageNotes: "",
      amenityIds: [],
    };
  }

  return {
    roomCode: room.roomCode,
    name: room.name,
    location: room.location,
    capacity: room.capacity,
    status: room.status,
    usageNotes: room.usageNotes ?? "",
    amenityIds: room.amenities.map((amenity) => amenity.id),
  };
}

export function buildInventoryRoomPayload(
  values: InventoryRoomFormValues,
): CreateRoomRequest {
  const usageNotes = values.usageNotes.trim();

  return {
    roomCode: values.roomCode.trim(),
    name: values.name.trim(),
    location: values.location.trim(),
    capacity: values.capacity,
    status: values.status,
    usageNotes: usageNotes.length > 0 ? usageNotes : undefined,
  };
}
