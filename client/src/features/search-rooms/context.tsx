import { createContext, useContext, type ReactNode } from "react";
import { useSearchRooms } from "./hooks/useSearchRooms";

type SearchRoomsContextValue = ReturnType<typeof useSearchRooms>;

const SearchRoomsContext = createContext<SearchRoomsContextValue | null>(null);

export function SearchRoomsProvider({ children }: { children: ReactNode }) {
  const value = useSearchRooms();
  return <SearchRoomsContext.Provider value={value}>{children}</SearchRoomsContext.Provider>;
}

export function useSearchRoomsContext() {
  const ctx = useContext(SearchRoomsContext);
  if (!ctx) throw new Error("useSearchRoomsContext must be used within SearchRoomsProvider");
  return ctx;
}
