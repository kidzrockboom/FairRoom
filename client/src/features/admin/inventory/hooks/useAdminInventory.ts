import { useCallback, useEffect, useMemo, useState } from "react";

import type { AdminRoomResponse, AmenityResponse } from "@/api/contracts";

import { buildInventorySummary } from "../adminInventoryMappers";
import { createAdminAmenity, loadAdminInventory, saveAdminRoom, toggleAdminRoomStatus } from "../adminInventoryService";
import type { InventoryRoomFormValues } from "../schemas";

export type InventorySheetMode = "add" | "edit";

export function useAdminInventory() {
  const [rooms, setRooms] = useState<AdminRoomResponse[]>([]);
  const [amenities, setAmenities] = useState<AmenityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetMode, setSheetMode] = useState<InventorySheetMode>("add");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<AdminRoomResponse | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await loadAdminInventory();
      setRooms(payload.rooms);
      setAmenities(payload.amenities);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load room inventory.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInventory();
  }, [loadInventory]);

  const openAddRoom = useCallback(() => {
    setActiveRoom(null);
    setSheetMode("add");
    setSaveError(null);
    setSheetOpen(true);
  }, []);

  const openEditRoom = useCallback((room: AdminRoomResponse) => {
    setActiveRoom(room);
    setSheetMode("edit");
    setSaveError(null);
    setSheetOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setActiveRoom(null);
    setSaveError(null);
  }, []);

  const handleSaveRoom = useCallback(
    async (values: InventoryRoomFormValues) => {
      setIsSaving(true);
      setSaveError(null);

      try {
        const saved = await saveAdminRoom(activeRoom?.id ?? null, values);
        await loadInventory();
        setActiveRoom(saved);
        setSheetOpen(false);
      } catch (err: unknown) {
        setSaveError(err instanceof Error ? err.message : "Failed to save room.");
      } finally {
        setIsSaving(false);
      }
    },
    [activeRoom?.id, loadInventory],
  );

  const handleCreateAmenity = useCallback(
    async (label: string) => {
      const amenity = await createAdminAmenity(label);
      setAmenities((current) => [...current, amenity].sort((left, right) => left.label.localeCompare(right.label)));
      return amenity;
    },
    [],
  );

  const handleToggleRoomStatus = useCallback(
    async (room: AdminRoomResponse) => {
      setRooms((current) =>
        current.map((candidate) =>
          candidate.id === room.id
            ? {
                ...candidate,
                status: room.status === "operational" ? "disabled" : "operational",
              }
            : candidate,
        ),
      );

      try {
        const updated = await toggleAdminRoomStatus(room);
        setRooms((current) => current.map((candidate) => (candidate.id === updated.id ? updated : candidate)));
      } catch (err: unknown) {
        await loadInventory();
        setError(err instanceof Error ? err.message : "Failed to update room status.");
      }
    },
    [loadInventory],
  );

  const summary = useMemo(() => buildInventorySummary(rooms), [rooms]);
  return {
    amenities,
    closeSheet,
    error,
    handleCreateAmenity,
    handleSaveRoom,
    handleToggleRoomStatus,
    isLoading,
    isSaving,
    openAddRoom,
    openEditRoom,
    rooms,
    saveError,
    refreshInventory: loadInventory,
    sheetMode,
    sheetOpen,
    selectedRoom: activeRoom,
    summary,
  };
}
