import axios from "axios";
import type {
  AccountActivityListResponse,
  AccountStatusResponse,
  AuthResponse,
  Booking,
  BookingListResponse,
  BookingScope,
  CreateBookingRequest,
  LoginRequest,
  ReminderListResponse,
  ReminderStatus,
  RegisterRequest,
  Room,
  RoomBookingsResponse,
  RoomSearchResponse,
  SearchRoomsParams,
  UserProfile,
} from "./contracts/index";

const DEFAULT_API_URL = "https://fairroom-production.up.railway.app";
const API_URL = import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL;
export const AUTH_TOKEN_STORAGE_KEY = "fairroom.authToken";

const client = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

const readApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    const maybeMessage = Reflect.get(responseData, "message");
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }

    const maybeError = Reflect.get(responseData, "error");
    if (typeof maybeError === "string" && maybeError.trim()) {
      return maybeError;
    }
  }

  return error.message || fallbackMessage;
};

const authHeaders = () => {
  try {
    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  } catch {
    return undefined;
  }
};

export const fairroomApi = {
  baseUrl: API_URL,

  getAuthToken() {
    try {
      return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  setAuthToken(token: string) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  },

  clearAuthToken() {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  },

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    try {
      const { data } = await client.post<AuthResponse>("/auth/register", payload);
      return data;
    } catch (error: unknown) {
      throw new Error(readApiErrorMessage(error, "Failed to register"));
    }
  },

  async login(payload: LoginRequest): Promise<AuthResponse> {
    try {
      const { data } = await client.post<AuthResponse>("/auth/login", payload);
      return data;
    } catch (error: unknown) {
      throw new Error(readApiErrorMessage(error, "Failed to sign in"));
    }
  },

  async getMe(): Promise<UserProfile> {
    try {
      const { data } = await client.get<UserProfile>("/me", {
        headers: authHeaders(),
      });
      return data;
    } catch (error: unknown) {
      throw new Error(readApiErrorMessage(error, "Failed to load current user"));
    }
  },

  async getAccountStatus(): Promise<AccountStatusResponse> {
    try {
      const { data } = await client.get<AccountStatusResponse>("/me/account-status", {
        headers: authHeaders(),
      });
      return data;
    } catch (error: unknown) {
      throw new Error(readApiErrorMessage(error, "Failed to load account status"));
    }
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
