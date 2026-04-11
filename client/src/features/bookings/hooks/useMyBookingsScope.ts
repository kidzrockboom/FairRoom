import { useCallback, useEffect, useMemo, useState } from "react";
import type { BookingScope } from "@/api/contracts";
import { buildBookingListViewModels, type BookingListItemViewModel } from "../myBookingsMappers";
import { loadMyBookings } from "../myBookingsService";

type UseMyBookingsScopeResult = {
  bookings: BookingListItemViewModel[];
  error: string | null;
  isLoading: boolean;
  page: number;
  pageSize: number;
  retry: () => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  total: number;
  totalPages: number;
};

export function useMyBookingsScope(
  scope: BookingScope,
  initialPageSize = 12,
): UseMyBookingsScopeResult {
  const [bookings, setBookings] = useState<BookingListItemViewModel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadIndex, setReloadIndex] = useState(0);

  const setPageSize = useCallback((nextPageSize: number) => {
    setPageSizeState(nextPageSize);
    setPage(1);
  }, []);

  useEffect(() => {
    setPageSizeState(initialPageSize);
    setPage(1);
  }, [initialPageSize]);

  const retry = useCallback(() => {
    setReloadIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await loadMyBookings(scope, page, pageSize);
        if (cancelled) return;

        setBookings(buildBookingListViewModels(response.items));
        setTotal(response.total);
        setPage(response.page);
        setPageSizeState(response.pageSize);
      } catch (err: unknown) {
        if (cancelled) return;

        setBookings([]);
        setTotal(0);
        setError(err instanceof Error ? err.message : "Failed to load bookings.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadIndex, scope, page, pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [pageSize, total],
  );

  return {
    bookings,
    error,
    isLoading,
    page,
    pageSize,
    retry,
    setPage,
    setPageSize,
    total,
    totalPages,
  };
}
