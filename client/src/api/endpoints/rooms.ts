import type { Room, RoomBookingsResponse, RoomSearchResponse, SearchRoomsParams } from "@/api/contracts";
import { apiClient } from "../client";

export async function searchRooms(params: SearchRoomsParams): Promise<RoomSearchResponse> {
  const { data } = await apiClient.get<RoomSearchResponse>("/rooms", { params });
  return data;
}

export async function getRoom(roomId: string): Promise<Room> {
  const { data } = await apiClient.get<Room>(`/rooms/${roomId}`);
  return data;
}

export async function getRoomBookings(roomId: string, date: string): Promise<RoomBookingsResponse> {
  const { data } = await apiClient.get<RoomBookingsResponse>(`/rooms/${roomId}/bookings`, {
    params: { date },
  });
  return data;
}
