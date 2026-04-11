import type {
  AdminRoomListResponse,
  AdminRoomQueryParams,
  AdminRoomResponse,
  AmenityListResponse,
  AmenityResponse,
  CreateAmenityRequest,
  CreateRoomRequest,
  SetRoomAmenitiesRequest,
  UpdateRoomRequest,
} from "@/api/contracts";
import { authHeaders } from "../auth-storage";
import { apiClient } from "../client";
import { readApiErrorMessage } from "../errors";

export async function getAdminRooms(
  params: AdminRoomQueryParams = {},
): Promise<AdminRoomListResponse> {
  try {
    const { data } = await apiClient.get<AdminRoomListResponse>("/admin/rooms", {
      headers: authHeaders(),
      params,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load room inventory."));
  }
}

export async function createAdminRoom(payload: CreateRoomRequest): Promise<AdminRoomResponse> {
  try {
    const { data } = await apiClient.post<AdminRoomResponse>("/admin/rooms", payload, {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to add room."));
  }
}

export async function updateAdminRoom(
  roomId: string,
  payload: UpdateRoomRequest,
): Promise<AdminRoomResponse> {
  try {
    const { data } = await apiClient.patch<AdminRoomResponse>(`/admin/rooms/${roomId}`, payload, {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to update room."));
  }
}

export async function getAdminAmenities(): Promise<AmenityListResponse> {
  try {
    const { data } = await apiClient.get<AmenityListResponse>("/admin/amenities", {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load amenities."));
  }
}

export async function createAdminAmenity(
  payload: CreateAmenityRequest,
): Promise<AmenityResponse> {
  try {
    const { data } = await apiClient.post<AmenityResponse>("/admin/amenities", payload, {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to add amenity."));
  }
}

export async function setAdminRoomAmenities(
  roomId: string,
  payload: SetRoomAmenitiesRequest,
): Promise<AdminRoomResponse> {
  try {
    const { data } = await apiClient.put<AdminRoomResponse>(
      `/admin/rooms/${roomId}/amenities`,
      payload,
      {
        headers: authHeaders(),
      },
    );
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to update room amenities."));
  }
}

export async function deleteAdminRoomAmenity(roomId: string, amenityId: string): Promise<void> {
  try {
    await apiClient.delete(`/admin/rooms/${roomId}/amenities/${amenityId}`, {
      headers: authHeaders(),
    });
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to remove room amenity."));
  }
}
