import { useState } from "react";

import InventoryAddRoomCard from "@/features/admin/inventory/components/InventoryAddRoomCard";
import InventoryBanner from "@/features/admin/inventory/components/InventoryBanner";
import InventoryRoomCard from "@/features/admin/inventory/components/InventoryRoomCard";
import InventoryRoomSheet from "@/features/admin/inventory/components/InventoryRoomSheet";
import InventoryStats from "@/features/admin/inventory/components/InventoryStats";
import { inventoryHeader } from "@/features/admin/inventory/content";
import { useAdminInventory } from "@/features/admin/inventory/hooks/useAdminInventory";
import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import Empty from "@/components/ui/empty";

function AdminInventoryPage() {
  const [showBanner, setShowBanner] = useState(true);
  const {
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
    refreshInventory,
    rooms,
    saveError,
    sheetMode,
    sheetOpen,
    selectedRoom,
    summary,
  } = useAdminInventory();

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

      {showBanner && <InventoryBanner onDismiss={() => setShowBanner(false)} />}

      {isLoading ? (
        <Loading className="min-h-[220px]" message="Loading room inventory..." />
      ) : error ? (
        <ErrorBlock className="min-h-[220px]" message={error} onRetry={refreshInventory} />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <InventoryAddRoomCard onClick={openAddRoom} />
            {rooms.map((room) => (
              <InventoryRoomCard
                key={room.id}
                room={room}
                onEdit={openEditRoom}
                onToggleStatus={handleToggleRoomStatus}
              />
            ))}
          </section>

          {rooms.length === 0 && (
            <Empty
              className="min-h-[220px]"
              description="Add a room to start managing the inventory."
              title="No rooms have been added yet"
              action={{ label: "Add New Room", onClick: openAddRoom }}
            />
          )}
        </>
      )}

      <InventoryRoomSheet
        amenityOptions={amenities}
        error={saveError}
        isSubmitting={isSaving}
        mode={sheetMode}
        onCancel={closeSheet}
        onCreateAmenity={handleCreateAmenity}
        onOpenChange={(open) => {
          if (!open) closeSheet();
        }}
        onSubmit={handleSaveRoom}
        open={sheetOpen}
        room={selectedRoom}
      />
    </div>
  );
}

export default AdminInventoryPage;
