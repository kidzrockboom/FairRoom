import { fairroomApi } from "@/api/fairroomApi";
import type { Booking, Room } from "@/api/contracts";

export type RoomWithBookings = {
  room: Room;
  bookings: Booking[];
};

export async function loadRoomDetails(roomId: string, date: string): Promise<RoomWithBookings> {
  const [room, bookingsResponse] = await Promise.all([
    fairroomApi.getRoom(roomId),
    fairroomApi.getRoomBookings(roomId, date),
  ]);

  return { room, bookings: bookingsResponse.items };
}

export async function loadRoomBookings(roomId: string, date: string): Promise<Booking[]> {
  const response = await fairroomApi.getRoomBookings(roomId, date);
  return response.items;
}
