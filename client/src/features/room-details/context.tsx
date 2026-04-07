import { createContext, useContext, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useRoomDetails } from "./hooks/useRoomDetails";

type RoomDetailsContextValue = ReturnType<typeof useRoomDetails>;

const RoomDetailsContext = createContext<RoomDetailsContextValue | null>(null);

export function RoomDetailsProvider({ children }: { children: ReactNode }) {
  const { roomId } = useParams<{ roomId: string }>();
  const value = useRoomDetails(roomId!);
  return <RoomDetailsContext.Provider value={value}>{children}</RoomDetailsContext.Provider>;
}

export function useRoomDetailsContext() {
  const ctx = useContext(RoomDetailsContext);
  if (!ctx) throw new Error("useRoomDetailsContext must be used within RoomDetailsProvider");
  return ctx;
}
