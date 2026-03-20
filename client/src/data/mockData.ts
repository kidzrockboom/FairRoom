import type { Booking, Room, User, TimeSlot } from "../types/types";

const createSlots = (reservedHours: number[]): TimeSlot[] =>
  Array.from({ length: 24 }, (_, hour) => ({
    hour,
    available: !reservedHours.includes(hour),
  }));

export const rooms: Room[] = [
  {
    id: 1,
    name: "Collaboration Lab 204",
    capacity: 6,
    location: "Central Library, Wing B, Level 2",
    roomCode: "RM-204-CL",
    amenities: ["wifi", "projector", "whiteboard"],
    usageNotes: "Optimized for group discussions and digital presentations.",
    slots: createSlots([9, 12, 13, 18]),
  },
  {
    id: 2,
    name: "Seminar Room A",
    capacity: 20,
    location: "Level 1, Main Hall",
    roomCode: "RM-A-MH",
    amenities: ["wifi", "projector"],
    usageNotes: "Best for seminars and presentations.",
    slots: createSlots([10, 11, 14, 15]),
  },
  {
    id: 3,
    name: "Quiet Pod 04",
    capacity: 1,
    location: "Library, North",
    roomCode: "QP-04",
    amenities: ["wifi"],
    usageNotes: "Single-person silent focus pod.",
    slots: createSlots([8, 16, 17]),
  },
  {
    id: 4,
    name: "Lab 210",
    capacity: 15,
    location: "Level 2, West Wing",
    roomCode: "LAB-210",
    amenities: ["wifi", "whiteboard"],
    usageNotes: "Ideal for technical collaboration.",
    slots: createSlots([9, 10, 19]),
  },
  {
    id: 5,
    name: "Meeting Room 09",
    capacity: 10,
    location: "Level 4, Center",
    roomCode: "MR-09",
    amenities: ["projector", "whiteboard"],
    usageNotes: "Good for planning sessions.",
    slots: createSlots([12, 13, 14]),
  },
  {
    id: 6,
    name: "Room 302",
    capacity: 4,
    location: "Level 3, East Wing",
    roomCode: "RM-302",
    amenities: ["wifi", "whiteboard"],
    usageNotes: "Compact room for small groups.",
    slots: createSlots([11, 15, 16]),
  },
];

export const users: User[] = [
  { id: 1, name: "Alice", strikes: 1, role: "student" },
];

export const bookings: Booking[] = [];