import { fairroomApi } from "@/api/fairroomApi";
import type { RoomSearchResponse, SearchRoomsParams } from "@/api/contracts";

export async function fetchRooms(params: SearchRoomsParams): Promise<RoomSearchResponse> {
  return fairroomApi.searchRooms(params);
}
