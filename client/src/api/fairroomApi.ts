import axios from "axios";
import {
  accountActivities,
  bookings,
  reminders,
  rooms,
  users,
} from "@/data/mockData";
import type {
  AccountActivityListResponse,
  AccountState,
  AccountStatusResponse,
  Booking,
  BookingListResponse,
  BookingScope,
  CreateBookingRequest,
  ReminderListResponse,
  ReminderStatus,
  Room,
  RoomBookingsResponse,
  RoomSearchResponse,
  SearchRoomsParams,
} from "./contracts/index";

const DEFAULT_API_URL = "https://oasf2ae7ab0f548.free.beeceptor.com";
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

  async getRoomBookings(roomId: string, date: string): Promise<RoomBookingsResponse> {
    return withFallback(
      async () => {
        const { data } = await client.get<RoomBookingsResponse>(`/rooms/${roomId}/bookings`, {
          params: { date },
        });
        return data;
      },
      () => {
        const items = bookings
          .filter((b) => b.roomId === roomId && b.startsAt.slice(0, 10) === date)
          .map(({ userId, ...booking }) => booking);
        return { items };
      },
    );
  },

  async createBooking(payload: CreateBookingRequest): Promise<Booking> {
    return withFallback(
      async () => {
        const { data } = await client.post<Booking>("/bookings", payload, {
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
