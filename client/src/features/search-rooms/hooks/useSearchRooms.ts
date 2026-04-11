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
  appliedFilters: Filters;
  draftFilters: Filters;
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
  | { type: "PATCH_DRAFT_FILTERS"; payload: Partial<Filters> }
  | { type: "RESET_DRAFT_FILTERS" }
  | { type: "APPLY_FILTERS" }
  | { type: "RESET_ALL_FILTERS" }
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
  appliedFilters: DEFAULT_FILTERS,
  draftFilters: DEFAULT_FILTERS,
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

function cloneFilters(filters: Filters): Filters {
  return {
    ...filters,
    timeRange: [...filters.timeRange] as [number, number],
    amenityIds: [...filters.amenityIds],
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PATCH_DRAFT_FILTERS":
      return { ...state, draftFilters: { ...state.draftFilters, ...action.payload } };

    case "RESET_DRAFT_FILTERS":
      return { ...state, draftFilters: cloneFilters(DEFAULT_FILTERS) };

    case "APPLY_FILTERS":
      return {
        ...state,
        appliedFilters: cloneFilters(state.draftFilters),
        page: 1,
      };

    case "RESET_ALL_FILTERS":
      return {
        ...state,
        appliedFilters: cloneFilters(DEFAULT_FILTERS),
        draftFilters: cloneFilters(DEFAULT_FILTERS),
        page: 1,
      };

    case "REMOVE_CHIP": {
      const updates: Partial<Filters> = {};
      if (action.payload === "date") updates.date = "";
      if (action.payload === "capacity") updates.capacity = null;
      if (action.payload === "time") updates.timeRange = [0, 24];
      return {
        ...state,
        appliedFilters: { ...state.appliedFilters, ...updates },
        draftFilters: { ...state.draftFilters, ...updates },
        page: 1,
      };
    }

    case "REMOVE_AMENITY": {
      const amenityIds = state.appliedFilters.amenityIds.filter((id) => id !== action.payload);
      return {
        ...state,
        appliedFilters: { ...state.appliedFilters, amenityIds },
        draftFilters: { ...state.draftFilters, amenityIds: [...amenityIds] },
        page: 1,
      };
    }

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

    const params = toSearchParams(state.appliedFilters, state.search, state.page, state.pageSize);

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
  }, [state.appliedFilters, state.search, state.page, state.pageSize]);

  const amenityFiltered = useMemo(() => {
    if (state.appliedFilters.amenityIds.length === 0) return state.rooms;
    return state.rooms.filter(
      (room) =>
        room.amenities != null &&
        state.appliedFilters.amenityIds.every((id) => room.amenities!.some((a) => a.id === id)),
    );
  }, [state.rooms, state.appliedFilters.amenityIds]);

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

    if (state.appliedFilters.date) {
      chips.push({ kind: "filter", id: "date", label: `Date: ${state.appliedFilters.date}` });
    }
    if (state.appliedFilters.capacity !== null) {
      chips.push({
        kind: "filter",
        id: "capacity",
        label: `Capacity: ${state.appliedFilters.capacity}+`,
      });
    }
    const [start, end] = state.appliedFilters.timeRange;
    if (start !== 0 || end !== 24) {
      const fmt = (h: number) => {
        const suffix = h >= 12 ? "PM" : "AM";
        const hour = h % 12 === 0 ? 12 : h % 12;
        return `${hour}${suffix}`;
      };
      chips.push({ kind: "filter", id: "time", label: `Time: ${fmt(start)} – ${fmt(end)}` });
    }
    state.appliedFilters.amenityIds.forEach((amenityId) => {
      const option = state.availableAmenities.find((a) => a.id === amenityId);
      if (option) chips.push({ kind: "amenity", amenityId, label: option.label });
    });

    return chips;
  }, [state.appliedFilters, state.availableAmenities]);

  const patchFilters = useCallback(
    (payload: Partial<Filters>) => dispatch({ type: "PATCH_DRAFT_FILTERS", payload }),
    [],
  );

  const resetDraftFilters = useCallback(() => dispatch({ type: "RESET_DRAFT_FILTERS" }), []);
  const applyFilters = useCallback(() => dispatch({ type: "APPLY_FILTERS" }), []);
  const resetFilters = useCallback(() => dispatch({ type: "RESET_ALL_FILTERS" }), []);
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
  const retry = useCallback(() => dispatch({ type: "RESET_ALL_FILTERS" }), []);

  return {
    filters: state.appliedFilters,
    draftFilters: state.draftFilters,
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
    resetDraftFilters,
    applyFilters,
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
