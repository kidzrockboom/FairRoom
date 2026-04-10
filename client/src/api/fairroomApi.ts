import axios from "axios";
import type {
  AccountActivityListResponse,
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

const DEFAULT_API_URL = "https://fairroom-production.up.railway.app";
const API_URL = import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL;

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

export const fairroomApi = {
  baseUrl: API_URL,

  async getAccountStatus(): Promise<AccountStatusResponse> {
    const { data } = await client.get<AccountStatusResponse>("/me/account-status", {
      headers: authHeaders(),
    });
    return data;
  },

  async getAccountActivities(): Promise<AccountActivityListResponse> {
    const { data } = await client.get<AccountActivityListResponse>("/me/account-activities", {
      headers: authHeaders(),
    });
    return data;
  },

  async getMyBookings(scope: BookingScope = "all", page = 1, pageSize = 10): Promise<BookingListResponse> {
    const { data } = await client.get<BookingListResponse>("/me/bookings", {
      headers: authHeaders(),
      params: { scope, page, pageSize },
    });
    return data;
  },

  async getMyReminders(status?: ReminderStatus): Promise<ReminderListResponse> {
    const { data } = await client.get<ReminderListResponse>("/me/reminders", {
      headers: authHeaders(),
      params: status ? { status } : undefined,
    });
    return data;
  },

  async searchRooms(params: SearchRoomsParams): Promise<RoomSearchResponse> {
    const { data } = await client.get<RoomSearchResponse>("/rooms", { params });
    return data;
  },

  async getRoom(roomId: string): Promise<Room> {
    const { data } = await client.get<Room>(`/rooms/${roomId}`);
    return data;
  },

  async getRoomBookings(roomId: string, date: string): Promise<RoomBookingsResponse> {
    const { data } = await client.get<RoomBookingsResponse>(`/rooms/${roomId}/bookings`, {
      params: { date },
    });
    return data;
  },

  async createBooking(payload: CreateBookingRequest): Promise<Booking> {
    const { data } = await client.post<Booking>("/bookings", payload, {
      headers: authHeaders(),
    });
    return data;
  },
};
