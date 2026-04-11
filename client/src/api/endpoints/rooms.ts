import type { Room, RoomBookingsResponse, RoomSearchResponse, SearchRoomsParams } from "@/api/contracts";
import { apiClient } from "../client";
import { readApiErrorMessage } from "../errors";

export async function searchRooms(params: SearchRoomsParams): Promise<RoomSearchResponse> {
  try {
    const { data } = await apiClient.get<RoomSearchResponse>("/rooms", { params });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load rooms."));
  }
}

export async function getRoom(roomId: string): Promise<Room> {
  try {
    const { data } = await apiClient.get<Room>(`/rooms/${roomId}`);
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load room details."));
  }
}

export async function getRoomBookings(roomId: string, date: string): Promise<RoomBookingsResponse> {
  try {
    const { data } = await apiClient.get<RoomBookingsResponse>(`/rooms/${roomId}/bookings`, {
      params: { date },
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load room bookings."));
  }
}
