import type { Room, Booking, User } from "../types/types";

export const rooms: Room[] = [
  { id: 1, name: "Room A", capacity: 1 },
  { id: 2, name: "Room B", capacity: 2 },
  { id: 3, name: "Room C", capacity: 4 },
];

export const users: User[] = [{ id: 1, name: "Alice", strikes: 1, role: "student" }];

export const bookings: Booking[] = [];