import { useState } from "react";

import InventoryAddRoomCard from "@/features/admin/inventory/components/InventoryAddRoomCard";
import InventoryDeleteDialog from "@/features/admin/inventory/components/InventoryDeleteDialog";
import InventoryBanner from "@/features/admin/inventory/components/InventoryBanner";
import InventoryRoomCard from "@/features/admin/inventory/components/InventoryRoomCard";
import InventoryRoomSheet from "@/features/admin/inventory/components/InventoryRoomSheet";
import InventoryStats from "@/features/admin/inventory/components/InventoryStats";
import {
  inventoryHeader,
  inventoryRooms,
} from "@/features/admin/inventory/content";

function AdminInventoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [activeRoom, setActiveRoom] = useState<(typeof inventoryRooms)[number] | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<(typeof inventoryRooms)[number] | null>(null);

  const summary = {
    totalSpaces: inventoryRooms.length,
    activeNow: inventoryRooms.filter((room) => room.status === "operational").length,
  };

  function openAddRoom() {
    setActiveRoom(null);
    setSheetMode("add");
    setSheetOpen(true);
  }

  function openEditRoom(room: (typeof inventoryRooms)[number]) {
    setActiveRoom(room);
    setSheetMode("edit");
    setSheetOpen(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
            {inventoryHeader.title}
          </h1>
          <p className="text-sm text-muted-foreground">{inventoryHeader.subtitle}</p>
        </div>

        <InventoryStats activeNow={summary.activeNow} totalSpaces={summary.totalSpaces} />
      </header>

      <InventoryBanner />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InventoryAddRoomCard onClick={openAddRoom} />
        {inventoryRooms.map((room) => (
          <InventoryRoomCard
            key={room.id}
            room={room}
            onDelete={setDeleteRoom}
            onEdit={openEditRoom}
          />
        ))}
      </section>

      <InventoryRoomSheet
        mode={sheetMode}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) {
            setActiveRoom(null);
          }
        }}
        open={sheetOpen}
        room={activeRoom}
      />

      <InventoryDeleteDialog
        open={Boolean(deleteRoom)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteRoom(null);
          }
        }}
        room={deleteRoom}
      />
    </div>
  );
}

export default AdminInventoryPage;
