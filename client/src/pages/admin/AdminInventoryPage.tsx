import InventoryAddRoomCard from "@/features/admin-inventory/components/InventoryAddRoomCard";
import InventoryBanner from "@/features/admin-inventory/components/InventoryBanner";
import InventoryRoomCard from "@/features/admin-inventory/components/InventoryRoomCard";
import InventoryStats from "@/features/admin-inventory/components/InventoryStats";
import {
  inventoryHeader,
  inventoryRooms,
} from "@/features/admin-inventory/adminInventoryContent";

function AdminInventoryPage() {
  const totalSpaces = inventoryRooms.length;
  const activeNow = inventoryRooms.filter((room) => room.isActive).length;

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
            {inventoryHeader.title}
          </h1>
          <p className="text-sm text-muted-foreground">{inventoryHeader.subtitle}</p>
        </div>

        <InventoryStats activeNow={activeNow} totalSpaces={totalSpaces} />
      </header>

      <InventoryBanner />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InventoryAddRoomCard />
        {inventoryRooms.map((room) => (
          <InventoryRoomCard key={room.id} room={room} />
        ))}
      </section>
    </div>
  );
}

export default AdminInventoryPage;
