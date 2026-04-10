import { fairroomApi } from "@/api/fairroomApi";
import type { AdminRoomResponse, AmenityResponse, UpdateRoomRequest } from "@/api/contracts";
import { readApiErrorMessage } from "@/api/errors";

import { buildInventoryRoomPayload } from "./adminInventoryMappers";
import type { InventoryRoomFormValues } from "./schemas";

export type AdminInventoryPayload = {
  rooms: AdminRoomResponse[];
  amenities: AmenityResponse[];
};

export async function loadAdminInventory(): Promise<AdminInventoryPayload> {
  try {
    const [roomsResponse, amenitiesResponse] = await Promise.all([
      fairroomApi.getAdminRooms(),
      fairroomApi.getAdminAmenities(),
    ]);

    return {
      rooms: roomsResponse.items,
      amenities: amenitiesResponse.items,
    };
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load room inventory."));
  }
}

export async function saveAdminRoom(
  roomId: string | null,
  values: InventoryRoomFormValues,
): Promise<AdminRoomResponse> {
  try {
    const payload = buildInventoryRoomPayload(values);
    const room = roomId
      ? await fairroomApi.updateAdminRoom(roomId, payload as UpdateRoomRequest)
      : await fairroomApi.createAdminRoom(payload);

    return await fairroomApi.setAdminRoomAmenities(room.id, {
      amenityIds: values.amenityIds,
    });
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to save room."));
  }
}

export async function toggleAdminRoomStatus(room: AdminRoomResponse): Promise<AdminRoomResponse> {
  try {
    return await fairroomApi.updateAdminRoom(room.id, {
      status: room.status === "operational" ? "disabled" : "operational",
    });
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to update room status."));
  }
}

export async function createAdminAmenity(label: string): Promise<AmenityResponse> {
  try {
    return await fairroomApi.createAdminAmenity({ label });
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to add amenity."));
  }
}
