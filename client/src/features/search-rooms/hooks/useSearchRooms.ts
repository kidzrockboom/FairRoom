import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { Amenity, Room } from "@/api/contracts";
import { toSearchParams } from "../mappers";
import { fetchRooms } from "../roomSearchService";
import type { Filters } from "../schemas";

type SortKey = "capacity-asc" | "capacity-desc" | "name-asc";

export type ActiveChip =
  | { kind: "filter"; id: "date" | "capacity" | "time"; label: string }
  | { kind: "amenity"; amenityId: string; label: string };

const DEFAULT_PAGE_SIZE = 12;

const DEFAULT_FILTERS: Filters = {
  date: "",
  capacity: null,
  timeRange: [0, 24],
  amenityIds: [],
};

type State = {
  filters: Filters;
  search: string;
  sort: SortKey;
  page: number;
  pageSize: number;
  rooms: Room[];
  availableAmenities: Amenity[];
  totalRooms: number;
  isLoading: boolean;
  error: string | null;
};

type Action =
  | { type: "PATCH_FILTERS"; payload: Partial<Filters> }
  | { type: "RESET" }
  | { type: "REMOVE_CHIP"; payload: "date" | "capacity" | "time" }
  | { type: "REMOVE_AMENITY"; payload: string }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_SORT"; payload: SortKey }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "FETCH_START" }
  | {
      type: "FETCH_SUCCESS";
      payload: { rooms: Room[]; totalRooms: number; page: number; pageSize: number };
    }
  | { type: "FETCH_ERROR"; payload: string };

const initialState: State = {
  filters: DEFAULT_FILTERS,
  search: "",
  sort: "capacity-asc",
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  rooms: [],
  availableAmenities: [],
  totalRooms: 0,
  isLoading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PATCH_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload }, page: 1 };

    case "RESET":
      return { ...state, filters: DEFAULT_FILTERS, search: "", page: 1 };

    case "REMOVE_CHIP": {
      const updates: Partial<Filters> = {};
      if (action.payload === "date") updates.date = "";
      if (action.payload === "capacity") updates.capacity = null;
      if (action.payload === "time") updates.timeRange = [0, 24];
      return { ...state, filters: { ...state.filters, ...updates }, page: 1 };
    }

    case "REMOVE_AMENITY":
      return {
        ...state,
        filters: {
          ...state.filters,
          amenityIds: state.filters.amenityIds.filter((id) => id !== action.payload),
        },
        page: 1,
      };

    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };

    case "SET_SORT":
      return { ...state, sort: action.payload };

    case "SET_PAGE":
      return { ...state, page: action.payload };

    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, page: 1 };

    case "FETCH_START":
      return { ...state, isLoading: true, error: null };

    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        rooms: action.payload.rooms,
        // Derive amenity filter options from the rooms payload.
        availableAmenities: action.payload.rooms
          .flatMap((room) => room.amenities ?? [])
          .filter((amenity, index, amenities) =>
            amenities.findIndex((item) => item.id === amenity.id) === index,
          )
          .sort((a, b) => a.label.localeCompare(b.label)),
        totalRooms: action.payload.totalRooms,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
      };

    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };

    default:
      return state;
  }
}

export function useSearchRooms() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "FETCH_START" });

    const params = toSearchParams(state.filters, state.search, state.page, state.pageSize);

    fetchRooms(params)
      .then((response) => {
        if (!cancelled)
          dispatch({
            type: "FETCH_SUCCESS",
            payload: {
              rooms: response.items,
              totalRooms: response.total,
              page: response.page,
              pageSize: response.pageSize,
            },
          });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load rooms";
          dispatch({ type: "FETCH_ERROR", payload: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [state.filters, state.search, state.page, state.pageSize]);

  const amenityFiltered = useMemo(() => {
    if (state.filters.amenityIds.length === 0) return state.rooms;
    return state.rooms.filter(
      (room) =>
        room.amenities != null &&
        state.filters.amenityIds.every((id) => room.amenities!.some((a) => a.id === id)),
    );
  }, [state.rooms, state.filters.amenityIds]);

  const sorted = useMemo(() => {
    const copy = [...amenityFiltered];
    if (state.sort === "capacity-asc") return copy.sort((a, b) => a.capacity - b.capacity);
    if (state.sort === "capacity-desc") return copy.sort((a, b) => b.capacity - a.capacity);
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }, [amenityFiltered, state.sort]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(state.totalRooms / state.pageSize)),
    [state.totalRooms, state.pageSize],
  );

  const activeChips = useMemo(() => {
    const chips: ActiveChip[] = [];

    if (state.filters.date) {
      chips.push({ kind: "filter", id: "date", label: `Date: ${state.filters.date}` });
    }
    if (state.filters.capacity !== null) {
      chips.push({ kind: "filter", id: "capacity", label: `Capacity: ${state.filters.capacity}+` });
    }
    const [start, end] = state.filters.timeRange;
    if (start !== 0 || end !== 24) {
      const fmt = (h: number) => {
        const suffix = h >= 12 ? "PM" : "AM";
        const hour = h % 12 === 0 ? 12 : h % 12;
        return `${hour}${suffix}`;
      };
      chips.push({ kind: "filter", id: "time", label: `Time: ${fmt(start)} – ${fmt(end)}` });
    }
    state.filters.amenityIds.forEach((amenityId) => {
      const option = state.availableAmenities.find((a) => a.id === amenityId);
      if (option) chips.push({ kind: "amenity", amenityId, label: option.label });
    });

    return chips;
  }, [state.availableAmenities, state.filters]);

  const patchFilters = useCallback(
    (payload: Partial<Filters>) => dispatch({ type: "PATCH_FILTERS", payload }),
    [],
  );

  const resetFilters = useCallback(() => dispatch({ type: "RESET" }), []);
  const removeChip = useCallback(
    (id: "date" | "capacity" | "time") => dispatch({ type: "REMOVE_CHIP", payload: id }),
    [],
  );
  const removeAmenity = useCallback(
    (amenityId: string) => dispatch({ type: "REMOVE_AMENITY", payload: amenityId }),
    [],
  );
  const setSearch = useCallback((q: string) => dispatch({ type: "SET_SEARCH", payload: q }), []);
  const setSort = useCallback((s: SortKey) => dispatch({ type: "SET_SORT", payload: s }), []);
  const setPage = useCallback((p: number) => dispatch({ type: "SET_PAGE", payload: p }), []);
  const setPageSize = useCallback(
    (pageSize: number) => dispatch({ type: "SET_PAGE_SIZE", payload: pageSize }),
    [],
  );
  const retry = useCallback(() => dispatch({ type: "RESET" }), []);

  return {
    filters: state.filters,
    search: state.search,
    sort: state.sort,
    page: state.page,
    pageSize: state.pageSize,
    isLoading: state.isLoading,
    error: state.error,
    rooms: sorted,
    availableAmenities: state.availableAmenities,
    totalRooms: state.totalRooms,
    totalPages,
    activeChips,
    patchFilters,
    resetFilters,
    removeChip,
    removeAmenity,
    setSearch,
    setSort,
    setPage,
    setPageSize,
    retry,
  };
}
