import { clearAuthToken, getAuthToken, setAuthToken } from "./auth-storage";
import { API_URL } from "./config";
import * as accountEndpoints from "./endpoints/account";
import * as adminEndpoints from "./endpoints/admin";
import * as adminRoomEndpoints from "./endpoints/admin-rooms";
import * as authEndpoints from "./endpoints/auth";
import * as bookingEndpoints from "./endpoints/bookings";
import * as roomEndpoints from "./endpoints/rooms";

export const fairroomApi = {
  baseUrl: API_URL,
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  ...authEndpoints,
  ...accountEndpoints,
  ...adminEndpoints,
  ...adminRoomEndpoints,
  ...roomEndpoints,
  ...bookingEndpoints,
};
