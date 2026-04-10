import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { Room, Booking } from "@/api/contracts";
import type { TimeSlot } from "@/features/search-rooms/components/SlotButton";
import { loadRoomDetails } from "../roomDetailsService";
import { deriveTimeSlots } from "../mappers";

const todayISO = () => new Date().toISOString().slice(0, 10);

type State = {
  room: Room | null;
  bookings: Booking[];
  selectedSlotIndex: number | null;
  date: string;
  isLoading: boolean;
  isLoadingBookings: boolean;
  error: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; room: Room; bookings: Booking[] }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "SET_DATE"; date: string }
  | { type: "SELECT_SLOT"; index: number | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, isLoadingBookings: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isLoadingBookings: false,
        room: action.room,
        bookings: action.bookings,
      };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, isLoadingBookings: false, error: action.error };
    case "SET_DATE":
      return { ...state, date: action.date, selectedSlotIndex: null };
    case "SELECT_SLOT":
      return { ...state, selectedSlotIndex: action.index };
    default:
      return state;
  }
}

export function useRoomDetails(roomId: string) {
  const [state, dispatch] = useReducer(reducer, {
    room: null,
    bookings: [],
    selectedSlotIndex: null,
    date: todayISO(),
    isLoading: true,
    isLoadingBookings: false,
    error: null,
  });

  const reload = useCallback(() => {
    dispatch({ type: "FETCH_START" });

    void loadRoomDetails(roomId, state.date)
      .then(({ room, bookings }) => {
        dispatch({ type: "FETCH_SUCCESS", room, bookings });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load room details";
        dispatch({ type: "FETCH_ERROR", error: message });
      });
  }, [roomId, state.date]);

  useEffect(() => {
    reload();
  }, [reload]);

  const slots = useMemo(
    () => deriveTimeSlots(state.bookings, state.date),
    [state.bookings, state.date],
  );

  const selectedSlot: TimeSlot | null =
    state.selectedSlotIndex !== null ? slots[state.selectedSlotIndex] ?? null : null;

  const setDate = useCallback((date: string) => dispatch({ type: "SET_DATE", date }), []);

  const selectSlot = useCallback((index: number | null) => dispatch({ type: "SELECT_SLOT", index }), []);

  const retry = useCallback(() => {
    reload();
  }, [reload]);

  return {
    room: state.room,
    slots,
    selectedSlot,
    selectedSlotIndex: state.selectedSlotIndex,
    date: state.date,
    isLoading: state.isLoading,
    isLoadingBookings: state.isLoadingBookings,
    error: state.error,
    setDate,
    selectSlot,
    retry,
  };
}
