import { useCallback, useEffect, useMemo, useState } from "react";
import type { Booking } from "@/api/contracts";
import { buildBookingReminderViewModel, type BookingReminderViewModel } from "../mappers";
import { loadBookingReminder } from "../bookingReminderService";

export type BookingReminderRouterState = {
  booking: Booking;
};

type BookingReminderState = {
  booking: Booking;
  roomError: string | null;
  isLoading: boolean;
  retry: () => void;
  viewModel: BookingReminderViewModel | null;
};

export function useBookingReminder(booking: Booking): BookingReminderState {
  const [isLoading, setIsLoading] = useState(true);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [viewModel, setViewModel] = useState<BookingReminderViewModel | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const retry = useCallback(() => {
    setReloadIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setRoomError(null);

      try {
        const payload = await loadBookingReminder(booking);

        if (cancelled) return;

        setViewModel(buildBookingReminderViewModel(payload.booking, payload.room, payload.reminders));
      } catch (error: unknown) {
        if (cancelled) return;

        setRoomError(error instanceof Error ? error.message : "Failed to load booking reminder");
        setViewModel(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [booking, reloadIndex]);

  return useMemo(
    () => ({
      booking,
      roomError,
      isLoading,
      retry,
      viewModel,
    }),
    [booking, isLoading, retry, roomError, viewModel],
  );
}
