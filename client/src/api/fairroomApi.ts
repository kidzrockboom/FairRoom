import axios from "axios";
import {
  accountActivities,
  bookings,
  reminders,
  roomAvailabilityTemplates,
  rooms,
  users,
} from "@/data/mockData";
import type {
  AccountActivityListResponse,
  AccountState,
  AccountStatusResponse,
  AvailabilityWindow,
  BookingListResponse,
  BookingScope,
  BookingSummary,
  CreateBookingRequest,
  ReminderListResponse,
  ReminderStatus,
  Room,
  RoomAvailabilityResponse,
  RoomSearchResponse,
  SearchRoomsParams,
} from "./contracts/index";

const DEFAULT_API_URL = "https://oas6fd22a2b268a.free.beeceptor.com";
const API_URL = import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL;
const CURRENT_USER_ID = "9b3f5d2e-4b8e-4a16-9e1f-2baf3a9e9d01";

const client = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

const authHeaders = () => {
  try {
    const token = window.localStorage.getItem("fairroom.authToken");
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  } catch {
    return undefined;
  }
};

const deriveAccountState = (activeStrikes: number): AccountState => {
  if (activeStrikes >= 3) return "restricted";
  if (activeStrikes === 2) return "warned";
  return "good";
};

const parseRequestedRange = (startsAt?: string, endsAt?: string) => {
  if (!startsAt || !endsAt) return null;
  const start = new Date(startsAt).getHours();
  const end = new Date(endsAt).getHours();
  return { start, end };
};

const deriveAvailabilityWindows = (
  roomId: string,
  startsAt: string,
  endsAt: string,
): AvailabilityWindow[] => {
  const range = parseRequestedRange(startsAt, endsAt);
  if (range == null) return [];

  const availability = roomAvailabilityTemplates[roomId] ?? [];
  const day = startsAt.slice(0, 10);

  return availability
    .filter((slot) => slot.hour >= range.start && slot.hour < range.end)
    .map((slot) => ({
      startsAt: new Date(`${day}T${String(slot.hour).padStart(2, "0")}:00:00`).toISOString(),
      endsAt: new Date(`${day}T${String(slot.hour + 1).padStart(2, "0")}:00:00`).toISOString(),
      status: slot.status,
    }));
};

const withFallback = async <T>(request: () => Promise<T>, fallback: () => T | Promise<T>) => {
  try {
    return await request();
  } catch {
    return await fallback();
  }
};

export const fairroomApi = {
  baseUrl: API_URL,

  async getAccountStatus(): Promise<AccountStatusResponse> {
    return withFallback(
      async () => {
        const { data } = await client.get<AccountStatusResponse>("/me/account-status", {
          headers: authHeaders(),
        });
        return data;
      },
      () => {
        const user = users[0];
        const activeStrikes = user?.activeStrikes ?? 0;

        return {
          activeStrikes,
          bookingEligible: activeStrikes < 3,
          accountState: deriveAccountState(activeStrikes),
        };
      },
    );
  },

  async getAccountActivities(): Promise<AccountActivityListResponse> {
    return withFallback(
      async () => {
        const { data } = await client.get<AccountActivityListResponse>("/me/account-activities", {
          headers: authHeaders(),
        });
        return data;
      },
      () => ({ items: accountActivities }),
    );
  },

  async getMyBookings(scope: BookingScope = "all", page = 1, pageSize = 10): Promise<BookingListResponse> {
    return withFallback(
      async () => {
        const { data } = await client.get<BookingListResponse>("/me/bookings", {
          headers: authHeaders(),
          params: { scope, page, pageSize },
        });
        return data;
      },
      () => {
        const now = Date.now();
        const items = bookings
          .filter((booking) => booking.userId === CURRENT_USER_ID)
          .filter((booking) => {
            if (scope === "all") return true;
            const endsAt = new Date(booking.endsAt).getTime();
            return scope === "active" ? endsAt >= now : endsAt < now;
          });

        return {
          items,
          page,
          pageSize,
          total: items.length,
        };
      },
    );
  },

  async getMyReminders(status?: ReminderStatus): Promise<ReminderListResponse> {
    return withFallback(
      async () => {
        const { data } = await client.get<ReminderListResponse>("/me/reminders", {
          headers: authHeaders(),
          params: status ? { status } : undefined,
        });
        return data;
      },
      () => {
        const visibleBookingIds = new Set(
          bookings.filter((booking) => booking.userId === CURRENT_USER_ID).map((booking) => booking.id),
        );
        const items = reminders
          .filter((reminder) => visibleBookingIds.has(reminder.bookingId))
          .filter((reminder) => (status ? reminder.status === status : true));

        return {
          items,
          total: items.length,
        };
      },
    );
  },

  async searchRooms(params: SearchRoomsParams): Promise<RoomSearchResponse> {
    const { data } = await client.get<RoomSearchResponse>("/rooms", { params });
    return data;
  },

  async getRoom(roomId: string): Promise<Room> {
    return withFallback(
      async () => {
        const { data } = await client.get<Room>(`/rooms/${roomId}`);
        return data;
      },
      () => {
        const room = rooms.find((candidate) => candidate.id === roomId);
        if (!room) throw new Error("Room not found");
        return room;
      },
    );
  },

  async getRoomAvailability(roomId: string, startsAt: string, endsAt: string): Promise<RoomAvailabilityResponse> {
    return withFallback(
      async () => {
        const { data } = await client.get<RoomAvailabilityResponse>(`/rooms/${roomId}/availability`, {
          params: { startsAt, endsAt },
        });
        return data;
      },
      () => {
        const room = rooms.find((candidate) => candidate.id === roomId);
        if (!room) throw new Error("Room not found");

        return {
          roomId,
          requestedStartsAt: startsAt,
          requestedEndsAt: endsAt,
          windows: deriveAvailabilityWindows(room.id, startsAt, endsAt),
        };
      },
    );
  },

  async createBooking(payload: CreateBookingRequest): Promise<BookingSummary> {
    return withFallback(
      async () => {
        const { data } = await client.post<BookingSummary>("/bookings", payload, {
          headers: authHeaders(),
        });
        return data;
      },
      () => ({
        id: `bk_mock_${Date.now()}`,
        roomId: payload.roomId,
        roomCode: rooms.find((room) => room.id === payload.roomId)?.roomCode ?? "UNKNOWN",
        roomName: rooms.find((room) => room.id === payload.roomId)?.name ?? "Unknown Room",
        startsAt: payload.startsAt,
        endsAt: payload.endsAt,
        status: "active",
        checkedIn: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );
  },
};
