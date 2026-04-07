export type UserRole = "student" | "admin";
export type BookingStatus = "active" | "cancelled" | "completed" | "no_show";
export type ReminderStatus = "scheduled" | "delivered" | "failed";
export type ReminderChannel = "email" | "push" | "sms";
export type AccountState = "good" | "warned" | "restricted";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Room {
  id: string;
  roomCode: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  amenities?: Amenity[];
  isAvailableForRequestedRange?: boolean;
}

export interface Amenity {
  id: string;
  label: string;
}

export interface AvailabilityWindow {
  startsAt: string;
  endsAt: string;
  status: "available" | "booked";
}

export interface BookingSummary {
  id: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  checkedIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  bookingId: string;
  channel: ReminderChannel;
  scheduledFor: string;
  sentAt: string | null;
  status: ReminderStatus;
  failureReason: string | null;
  createdAt: string;
}

export interface AccountActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  occurredAt: string;
  status: string;
  sourceEntityType: string;
  sourceEntityId: string;
}
