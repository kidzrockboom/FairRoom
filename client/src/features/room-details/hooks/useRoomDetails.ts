import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { Room, Booking } from "@/api/contracts";
import type { TimeSlot } from "@/features/search-rooms/components/SlotButton";
import { loadRoomDetails, loadRoomBookings } from "../roomDetailsService";
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
  | { type: "BOOKINGS_START" }
  | { type: "BOOKINGS_SUCCESS"; bookings: Booking[] }
  | { type: "BOOKINGS_ERROR"; error: string }
  | { type: "SET_DATE"; date: string }
  | { type: "SELECT_SLOT"; index: number | null };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, room: action.room, bookings: action.bookings };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.error };
    case "BOOKINGS_START":
      return { ...state, isLoadingBookings: true, selectedSlotIndex: null };
    case "BOOKINGS_SUCCESS":
      return { ...state, isLoadingBookings: false, bookings: action.bookings };
    case "BOOKINGS_ERROR":
      return { ...state, isLoadingBookings: false, error: action.error };
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

  // Initial parallel fetch
  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "FETCH_START" });

    loadRoomDetails(roomId, state.date)
      .then(({ room, bookings }) => {
        if (!cancelled) dispatch({ type: "FETCH_SUCCESS", room, bookings });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load room details";
          dispatch({ type: "FETCH_ERROR", error: message });
        }
      });

    return () => { cancelled = true; };
  // Only on mount / roomId change — date changes use the bookings-only fetch below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Re-fetch bookings only when date changes (after initial load)
  useEffect(() => {
    if (state.isLoading || !state.room) return;

    let cancelled = false;
    dispatch({ type: "BOOKINGS_START" });

    loadRoomBookings(roomId, state.date)
      .then((bookings) => {
        if (!cancelled) dispatch({ type: "BOOKINGS_SUCCESS", bookings });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load bookings";
          dispatch({ type: "BOOKINGS_ERROR", error: message });
        }
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, state.date]);

  const slots = useMemo(
    () => deriveTimeSlots(state.bookings, state.date),
    [state.bookings, state.date],
  );

  const selectedSlot: TimeSlot | null =
    state.selectedSlotIndex !== null ? slots[state.selectedSlotIndex] ?? null : null;

  const setDate = useCallback((date: string) => dispatch({ type: "SET_DATE", date }), []);

  const selectSlot = useCallback((index: number | null) => dispatch({ type: "SELECT_SLOT", index }), []);

  const retry = useCallback(() => {
    dispatch({ type: "FETCH_START" });
    loadRoomDetails(roomId, state.date)
      .then(({ room, bookings }) => dispatch({ type: "FETCH_SUCCESS", room, bookings }))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load room details";
        dispatch({ type: "FETCH_ERROR", error: message });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, state.date]);

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
