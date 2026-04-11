import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { AdminBookingStatusFilter, AdminBookingRowViewModel } from "../adminBookingsMappers";
import { buildAdminBookingQuery, buildAdminBookingRowViewModel } from "../adminBookingsMappers";
import { loadAdminBookings } from "../adminBookingsService";

type State = {
  search: string;
  status: AdminBookingStatusFilter;
  date: string;
  page: number;
  pageSize: number;
  bookings: AdminBookingRowViewModel[];
  total: number;
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_STATUS"; payload: AdminBookingStatusFilter }
  | { type: "SET_DATE"; payload: string }
  | { type: "RESET" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { bookings: AdminBookingRowViewModel[]; total: number } }
  | { type: "FETCH_ERROR"; payload: string };

const DEFAULT_PAGE_SIZE = 12;

const initialState: State = {
  search: "",
  status: "all",
  date: "",
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  bookings: [],
  total: 0,
  isLoading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_STATUS":
      return { ...state, status: action.payload, page: 1 };
    case "SET_DATE":
      return { ...state, date: action.payload, page: 1 };
    case "RESET":
      return { ...initialState, pageSize: state.pageSize };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, page: 1 };
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, bookings: action.payload.bookings, total: action.payload.total };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function useAdminBookings() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "FETCH_START" });

    const params = buildAdminBookingQuery(state.search, state.status, state.date, state.page, state.pageSize);

    loadAdminBookings(params)
      .then((response) => {
        if (!cancelled) {
          dispatch({
            type: "FETCH_SUCCESS",
            payload: {
              bookings: response.items.map(buildAdminBookingRowViewModel),
              total: response.total,
            },
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          dispatch({
            type: "FETCH_ERROR",
            payload: error instanceof Error ? error.message : "Failed to load admin bookings.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [state.date, state.page, state.pageSize, state.search, state.status]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(state.total / state.pageSize)),
    [state.pageSize, state.total],
  );

  const setSearch = useCallback((value: string) => dispatch({ type: "SET_SEARCH", payload: value }), []);
  const setStatus = useCallback(
    (value: AdminBookingStatusFilter) => dispatch({ type: "SET_STATUS", payload: value }),
    [],
  );
  const setDate = useCallback((value: string) => dispatch({ type: "SET_DATE", payload: value }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const setPage = useCallback((value: number) => dispatch({ type: "SET_PAGE", payload: value }), []);
  const setPageSize = useCallback(
    (value: number) => dispatch({ type: "SET_PAGE_SIZE", payload: value }),
    [],
  );

  return {
    bookings: state.bookings,
    date: state.date,
    error: state.error,
    isLoading: state.isLoading,
    page: state.page,
    pageSize: state.pageSize,
    search: state.search,
    status: state.status,
    total: state.total,
    totalPages,
    reset,
    setDate,
    setPage,
    setPageSize,
    setSearch,
    setStatus,
  };
}
