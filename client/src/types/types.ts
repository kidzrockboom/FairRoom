export type Amenity = "wifi" | "projector" | "whiteboard";

export interface TimeSlot {
  hour: number; // 0..23
  available: boolean;
}

export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  roomCode: string;
  amenities: Amenity[];
  usageNotes: string;
  slots: TimeSlot[]; // per-hour availability
}

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  date: string; // YYYY-MM-DD
  startHour: number; // 0..23
  endHour: number;   // 1..24
}

export interface User {
  id: number;
  name: string;
  strikes: number;
  role: "student" | "admin";
}