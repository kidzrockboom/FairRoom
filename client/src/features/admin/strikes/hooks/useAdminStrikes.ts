import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import type { AdminUserItem } from "@/api/contracts";
import { addStrike, loadStrikeDirectory, loadStudentStrikes, revokeStrike } from "../strikesService";
import {
  buildStrikeDirectoryRows,
  buildStrikeStudentViewModel,
  type StrikeDirectoryRowViewModel,
  type StrikeStudentViewModel,
} from "../strikesMappers";

type State = {
  search: string;
  users: StrikeDirectoryRowViewModel[];
  selectedUserId: string | null;
  student: StrikeStudentViewModel | null;
  isDirectoryLoading: boolean;
  isStudentLoading: boolean;
  isSaving: boolean;
  error: string | null;
  adjustmentDelta: number;
  reason: string;
  refreshToken: number;
};

type Action =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_USERS"; payload: StrikeDirectoryRowViewModel[] }
  | { type: "SET_SELECTED_USER_ID"; payload: string | null }
  | { type: "SET_STUDENT"; payload: StrikeStudentViewModel | null }
  | { type: "SET_DIRECTORY_LOADING"; payload: boolean }
  | { type: "SET_STUDENT_LOADING"; payload: boolean }
  | { type: "SET_SAVING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DELTA"; payload: number }
  | { type: "SET_REASON"; payload: string }
  | { type: "RESET_ADJUSTMENT" }
  | { type: "BUMP_REFRESH" };

const initialState: State = {
  search: "",
  users: [],
  selectedUserId: null,
  student: null,
  isDirectoryLoading: false,
  isStudentLoading: false,
  isSaving: false,
  error: null,
  adjustmentDelta: 0,
  reason: "",
  refreshToken: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_SELECTED_USER_ID":
      return { ...state, selectedUserId: action.payload, adjustmentDelta: 0, reason: "" };
    case "SET_STUDENT":
      return { ...state, student: action.payload, adjustmentDelta: 0, reason: "" };
    case "SET_DIRECTORY_LOADING":
      return { ...state, isDirectoryLoading: action.payload };
    case "SET_STUDENT_LOADING":
      return { ...state, isStudentLoading: action.payload };
    case "SET_SAVING":
      return { ...state, isSaving: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_DELTA":
      return { ...state, adjustmentDelta: action.payload };
    case "SET_REASON":
      return { ...state, reason: action.payload };
    case "RESET_ADJUSTMENT":
      return { ...state, adjustmentDelta: 0, reason: "" };
    case "BUMP_REFRESH":
      return { ...state, refreshToken: state.refreshToken + 1 };
    default:
      return state;
  }
}

function selectFirstUser(users: AdminUserItem[], selectedUserId: string | null) {
  if (selectedUserId && users.some((user) => user.id === selectedUserId)) {
    return selectedUserId;
  }
  return users[0]?.id ?? null;
}

export function useAdminStrikes() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    selectedUserIdRef.current = state.selectedUserId;
  }, [state.selectedUserId]);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "SET_DIRECTORY_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    loadStrikeDirectory(
      state.search.trim()
        ? {
            search: state.search.trim(),
          }
        : {},
    )
      .then((response) => {
        if (cancelled) return;
        const rows = buildStrikeDirectoryRows(response);
        dispatch({ type: "SET_USERS", payload: rows });
        dispatch({
          type: "SET_SELECTED_USER_ID",
          payload: selectFirstUser(response.items, selectedUserIdRef.current),
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          dispatch({
            type: "SET_ERROR",
            payload: error instanceof Error ? error.message : "Failed to load students.",
          });
        }
      })
      .finally(() => {
        if (!cancelled) {
          dispatch({ type: "SET_DIRECTORY_LOADING", payload: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [state.refreshToken, state.search]);

  useEffect(() => {
    if (!state.selectedUserId) {
      dispatch({ type: "SET_STUDENT", payload: null });
      return;
    }

    let cancelled = false;
    dispatch({ type: "SET_STUDENT_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    loadStudentStrikes(state.selectedUserId)
      .then((response) => {
        if (cancelled) return;
        const user = state.users.find((item) => item.id === state.selectedUserId);
        if (!user) return;

        dispatch({
          type: "SET_STUDENT",
          payload: buildStrikeStudentViewModel(
            {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              activeStrikes: user.activeStrikes,
              accountState: user.accountState,
            },
            response,
          ),
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          dispatch({
            type: "SET_ERROR",
            payload: error instanceof Error ? error.message : "Failed to load strike history.",
          });
        }
      })
      .finally(() => {
        if (!cancelled) {
          dispatch({ type: "SET_STUDENT_LOADING", payload: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [state.refreshToken, state.selectedUserId, state.users]);

  const selectedUser = useMemo(
    () => state.users.find((user) => user.id === state.selectedUserId) ?? null,
    [state.selectedUserId, state.users],
  );

  const activeStrikes = state.student?.activeStrikes ?? selectedUser?.activeStrikes ?? 0;
  const proposedStrikes = Math.max(0, activeStrikes + state.adjustmentDelta);

  const setSearch = useCallback((value: string) => dispatch({ type: "SET_SEARCH", payload: value }), []);
  const selectUser = useCallback((userId: string) => dispatch({ type: "SET_SELECTED_USER_ID", payload: userId }), []);
  const increase = useCallback(() => dispatch({ type: "SET_DELTA", payload: state.adjustmentDelta + 1 }), [state.adjustmentDelta]);
  const decrease = useCallback(
    () => dispatch({ type: "SET_DELTA", payload: Math.max(-activeStrikes, state.adjustmentDelta - 1) }),
    [activeStrikes, state.adjustmentDelta],
  );
  const reset = useCallback(() => dispatch({ type: "RESET_ADJUSTMENT" }), []);
  const setReason = useCallback((value: string) => dispatch({ type: "SET_REASON", payload: value }), []);

  const save = useCallback(async () => {
    if (!state.selectedUserId || state.adjustmentDelta === 0) {
      return;
    }

    dispatch({ type: "SET_SAVING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      if (state.adjustmentDelta > 0) {
        const reason = state.reason.trim();
        if (!reason) {
          throw new Error("Please provide a reason for the strike adjustment.");
        }

        await addStrike({
          userId: state.selectedUserId,
          reason,
        });
      } else {
        const latestActiveStrike = state.student?.history.find((item) => item.badge === "added");
        if (!latestActiveStrike) {
          throw new Error("There is no active strike to revoke.");
        }

        await revokeStrike(latestActiveStrike.id, {
          reason: state.reason.trim() || undefined,
        });
      }

      dispatch({ type: "BUMP_REFRESH" });
    } catch (error: unknown) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "Failed to save strike changes.",
      });
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  }, [state.adjustmentDelta, state.reason, state.selectedUserId, state.student?.history]);

  return {
    adjustmentDelta: state.adjustmentDelta,
    activeStrikes,
    decrease,
    directoryLoading: state.isDirectoryLoading,
    error: state.error,
    increase,
    isSaving: state.isSaving,
    proposedStrikes,
    reason: state.reason,
    reset,
    save,
    search: state.search,
    selectedUser,
    selectedUserId: state.selectedUserId,
    setReason,
    setSearch,
    selectUser,
    student: state.student,
    students: state.users,
    studentLoading: state.isStudentLoading,
  };
}
