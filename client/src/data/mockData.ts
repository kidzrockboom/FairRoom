import type {
  AccountActivityItem,
  Booking,
  Reminder,
  Room,
  UserProfile,
} from "@/api/contracts";

export type MockUser = UserProfile & {
  activeStrikes: number;
};

export type MockBooking = Booking & {
  userId: string;
};

const CURRENT_USER_ID = "9b3f5d2e-4b8e-4a16-9e1f-2baf3a9e9d01";

const addHours = (base: Date, hours: number) => new Date(base.getTime() + hours * 60 * 60 * 1000);

const bookingStart = (() => {
  const value = addHours(new Date(), 1);
  value.setMinutes(0, 0, 0);
  return value;
})();

const bookingEnd = addHours(bookingStart, 2);
const createdAt = "2026-03-01T08:00:00Z";

export const rooms: Room[] = [
  {
    id: "room_01",
    roomCode: "RM-204-CL",
    name: "Collaboration Lab 204",
    capacity: 6,
    location: "Central Library, Wing B, Level 2",
    isActive: true,
    createdAt,
  },
  {
    id: "room_02",
    roomCode: "RM-A-MH",
    name: "Seminar Room A",
    capacity: 20,
    location: "Level 1, Main Hall",
    isActive: true,
    createdAt,
  },
  {
    id: "room_03",
    roomCode: "QP-04",
    name: "Quiet Pod 04",
    capacity: 1,
    location: "Floor 3, Central Library",
    isActive: true,
    createdAt,
  },
];

export const users: MockUser[] = [
  {
    id: CURRENT_USER_ID,
    fullName: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    createdAt: "2026-01-10T09:30:00Z",
    activeStrikes: 1,
  },
];

export const bookings: MockBooking[] = [
  {
    id: "bk_1001",
    roomId: "room_03",
    roomCode: "QP-04",
    roomName: "Quiet Pod 04",
    startsAt: bookingStart.toISOString(),
    endsAt: bookingEnd.toISOString(),
    status: "active",
    checkedIn: false,
    createdAt: "2026-03-29T10:05:00Z",
    updatedAt: "2026-03-29T10:05:00Z",
    userId: CURRENT_USER_ID,
  },
];

export const reminders: Reminder[] = [
  {
    id: "rem_bk_1001_email_0",
    bookingId: "bk_1001",
    channel: "email",
    scheduledFor: addHours(bookingStart, -1).toISOString(),
    sentAt: addHours(bookingStart, -1).toISOString(),
    status: "delivered",
    failureReason: null,
    createdAt: "2026-03-29T10:06:00Z",
  },
  {
    id: "rem_bk_1001_push_1",
    bookingId: "bk_1001",
    channel: "push",
    scheduledFor: addHours(bookingStart, -0.5).toISOString(),
    sentAt: addHours(bookingStart, -0.5).toISOString(),
    status: "delivered",
    failureReason: null,
    createdAt: "2026-03-29T10:06:00Z",
  },
  {
    id: "rem_bk_1001_sms_2",
    bookingId: "bk_1001",
    channel: "sms",
    scheduledFor: addHours(bookingStart, -(25 / 60)).toISOString(),
    sentAt: null,
    status: "scheduled",
    failureReason: null,
    createdAt: "2026-03-29T10:06:00Z",
  },
];

export const accountActivities: AccountActivityItem[] = [
  {
    id: "act_1",
    type: "strike_recorded",
    title: "Strike Added",
    description: "No-show for Room 402 (14:00 - 15:30)",
    occurredAt: "2026-03-24T14:00:00Z",
    status: "incident",
    sourceEntityType: "strike",
    sourceEntityId: "str_1",
  },
];
