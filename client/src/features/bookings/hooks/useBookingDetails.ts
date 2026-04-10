import { useCallback, useEffect, useMemo, useState } from "react";
import { buildBookingDetailsViewModel, type BookingDetailsViewModel } from "../bookingDetailsMappers";
import { loadBookingDetails } from "../bookingDetailsService";

type BookingDetailsState = {
  bookingError: string | null;
  isLoading: boolean;
  retry: () => void;
  viewModel: BookingDetailsViewModel | null;
};

export function useBookingDetails(bookingId: string): BookingDetailsState {
  const [isLoading, setIsLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [viewModel, setViewModel] = useState<BookingDetailsViewModel | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const retry = useCallback(() => {
    setReloadIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setBookingError(null);

      try {
        const payload = await loadBookingDetails(bookingId);

        if (cancelled) return;

        setViewModel(buildBookingDetailsViewModel(payload));
      } catch (error: unknown) {
        if (cancelled) return;

        setBookingError(error instanceof Error ? error.message : "Failed to load booking details");
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
  }, [bookingId, reloadIndex]);

  return useMemo(
    () => ({
      bookingError,
      isLoading,
      retry,
      viewModel,
    }),
    [bookingError, isLoading, retry, viewModel],
  );
}
