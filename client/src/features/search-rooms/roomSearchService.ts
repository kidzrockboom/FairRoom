import { fairroomApi } from "@/api/fairroomApi";
import type { Room, SearchRoomsParams } from "@/api/contracts";

export async function fetchRooms(params: SearchRoomsParams): Promise<Room[]> {
  const response = await fairroomApi.searchRooms(params);
  return response.items;
}
