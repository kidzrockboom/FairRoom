import axios from "axios";
import { accountActivities, bookings, rooms, users } from "../data/mockData";
import type {
  AccountActivityItem,
  AccountActivityListResponse,
  AccountState,
  AccountStatusResponse,
  AvailabilityWindow,
  BookingListResponse,
  BookingScope,
  BookingStatus,
  BookingSummary,
  CreateBookingRequest,
  Reminder,
  ReminderListResponse,
  ReminderStatus,
  Room,
  RoomAvailabilityResponse,
  RoomSearchItem,
  RoomSearchResponse,
  SearchRoomsParams,
} from "./contracts";

const DEFAULT_API_URL = "https://oasd5f85395cf35.free.beeceptor.com";
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

const roomApiId = (id: number) => `room_${String(id).padStart(2, "0")}`;
const bookingApiId = (id: number) => `bk_${id}`;

const toIsoFromHour = (date: string, hour: number) =>
  new Date(`${date}T${String(hour).padStart(2, "0")}:00:00`).toISOString();

const deriveAccountState = (activeStrikes: number): AccountState => {
  if (activeStrikes >= 3) return "restricted";
  if (activeStrikes === 2) return "warned";
  return "good";
};

const mapRoomSearchItem = (
  room: (typeof rooms)[number],
  requestedRange: { start: number; end: number } | null | undefined,
): RoomSearchItem => {
  const isAvailableForRequestedRange =
    requestedRange == null
      ? true
      : room.slots
          .filter((slot) => slot.hour >= requestedRange.start && slot.hour < requestedRange.end)
          .every((slot) => slot.available);

  return {
    id: roomApiId(room.id),
    roomCode: room.roomCode,
    name: room.name,
    location: room.location,
    capacity: room.capacity,
    isAvailableForRequestedRange,
  };
};

const mapRoom = (room: (typeof rooms)[number]): Room => ({
  id: roomApiId(room.id),
  roomCode: room.roomCode,
  name: room.name,
  location: room.location,
  capacity: room.capacity,
  isActive: true,
  createdAt: "2026-03-01T08:00:00Z",
});

const mapBookingStatus = (date: string, endHour: number): BookingStatus => {
  const now = Date.now();
  const endsAt = new Date(`${date}T${String(endHour).padStart(2, "0")}:00:00`).getTime();
  return endsAt < now ? "completed" : "active";
};

const mapBookingSummary = (booking: (typeof bookings)[number]): BookingSummary => {
  const room = rooms.find((candidate) => candidate.id === booking.roomId);

  return {
    id: bookingApiId(booking.id),
    roomId: roomApiId(booking.roomId),
    roomCode: room?.roomCode ?? "UNKNOWN",
    roomName: room?.name ?? "Unknown Room",
    startsAt: toIsoFromHour(booking.date, booking.startHour),
    endsAt: toIsoFromHour(booking.date, booking.endHour),
    status: mapBookingStatus(booking.date, booking.endHour),
    checkedIn: booking.checkedIn,
    createdAt: "2026-03-29T10:05:00Z",
    updatedAt: "2026-03-29T10:05:00Z",
  };
};

const mapReminderStatus = (status: "delivered" | "pending"): ReminderStatus =>
  status === "pending" ? "scheduled" : "delivered";

const mapReminder = (booking: (typeof bookings)[number], index: number, notification: (typeof bookings)[number]["notifications"][number]): Reminder => ({
  id: `rem_${booking.id}_${notification.channel}_${index}`,
  bookingId: bookingApiId(booking.id),
  channel: notification.channel,
  scheduledFor: new Date(`${booking.date}T${notification.time}:00`).toISOString(),
  sentAt: notification.status === "delivered" ? new Date(`${booking.date}T${notification.time}:00`).toISOString() : null,
  status: mapReminderStatus(notification.status),
  failureReason: null,
  createdAt: "2026-03-29T10:06:00Z",
});

const mapAccountActivityItem = (item: (typeof accountActivities)[number]): AccountActivityItem => ({
  id: `act_${item.id}`,
  type: item.status === "incident" ? "strike_recorded" : "booking_created",
  title: item.title,
  description: item.description,
  occurredAt: new Date(item.dateLabel).toISOString(),
  status: item.status,
  sourceEntityType: item.status === "incident" ? "strike" : "booking",
  sourceEntityId: item.status === "incident" ? `str_${item.id}` : bookingApiId(item.id),
});

const parseRequestedRange = (startsAt?: string, endsAt?: string) => {
  if (!startsAt || !endsAt) return null;
  const start = new Date(startsAt).getHours();
  const end = new Date(endsAt).getHours();
  return { start, end };
};

const deriveAvailabilityWindows = (
  room: (typeof rooms)[number],
  startsAt: string,
  endsAt: string,
): AvailabilityWindow[] => {
  const range = parseRequestedRange(startsAt, endsAt);
  if (range == null) return [];

  return room.slots
    .filter((slot) => slot.hour >= range.start && slot.hour < range.end)
    .map((slot) => ({
      startsAt: toIsoFromHour(startsAt.slice(0, 10), slot.hour),
      endsAt: toIsoFromHour(startsAt.slice(0, 10), slot.hour + 1),
      status: slot.available ? "available" : "booked",
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
        const activeStrikes = user?.strikes ?? 0;
        const accountState = deriveAccountState(activeStrikes);

        return {
          activeStrikes,
          bookingEligible: activeStrikes < 3,
          accountState,
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
      () => ({
        items: accountActivities
          .filter((item) => item.userId === CURRENT_USER_ID)
          .map(mapAccountActivityItem),
      }),
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
          .map(mapBookingSummary)
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
        const items = bookings
          .filter((booking) => booking.userId === CURRENT_USER_ID)
          .flatMap((booking) => booking.notifications.map((notification, index) => mapReminder(booking, index, notification)))
          .filter((reminder) => (status ? reminder.status === status : true));

        return {
          items,
          total: items.length,
        };
      },
    );
  },

  async searchRooms(params: SearchRoomsParams): Promise<RoomSearchResponse> {
    return withFallback(
      async () => {
        const { data } = await client.get<RoomSearchResponse>("/rooms", {
          params,
        });
        return data;
      },
      () => {
        const requestedRange = parseRequestedRange(params.startsAt, params.endsAt);
        let items = rooms
          .filter((room) => {
            const matchSearch = params.search
              ? `${room.name} ${room.roomCode}`.toLowerCase().includes(params.search.toLowerCase())
              : true;
            const matchCapacity = params.minCapacity ? room.capacity >= params.minCapacity : true;
            return matchSearch && matchCapacity;
          })
          .map((room) => mapRoomSearchItem(room, requestedRange));

        if (params.onlyAvailable) {
          items = items.filter((room) => room.isAvailableForRequestedRange);
        }

        const page = params.page ?? 1;
        const pageSize = params.pageSize ?? 10;
        const startIndex = (page - 1) * pageSize;

        return {
          items: items.slice(startIndex, startIndex + pageSize),
          page,
          pageSize,
          total: items.length,
        };
      },
    );
  },

  async getRoom(roomId: string): Promise<Room> {
    return withFallback(
      async () => {
        const { data } = await client.get<Room>(`/rooms/${roomId}`);
        return data;
      },
      () => {
        const room = rooms.find((candidate) => roomApiId(candidate.id) === roomId);
        if (!room) throw new Error("Room not found");
        return mapRoom(room);
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
        const room = rooms.find((candidate) => roomApiId(candidate.id) === roomId);
        if (!room) throw new Error("Room not found");

        return {
          roomId,
          requestedStartsAt: startsAt,
          requestedEndsAt: endsAt,
          windows: deriveAvailabilityWindows(room, startsAt, endsAt),
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
        roomCode: rooms.find((room) => roomApiId(room.id) === payload.roomId)?.roomCode ?? "UNKNOWN",
        roomName: rooms.find((room) => roomApiId(room.id) === payload.roomId)?.name ?? "Unknown Room",
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
