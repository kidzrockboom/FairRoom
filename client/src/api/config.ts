const DEFAULT_API_URL = "https://fairroom-production.up.railway.app";

export const API_URL = import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_URL;
export const AUTH_TOKEN_STORAGE_KEY = "fairroom.authToken";
