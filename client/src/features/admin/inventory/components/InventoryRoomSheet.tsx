import { Sheet, SheetContent } from "@/components/ui/sheet";

import InventoryRoomForm from "@/features/admin/inventory/components/InventoryRoomForm";
import type { InventoryRoom } from "@/features/admin/inventory/content";

type InventoryRoomSheetProps = {
  mode: "add" | "edit";
  open: boolean;
  room?: InventoryRoom | null;
  onOpenChange: (open: boolean) => void;
};

export default function InventoryRoomSheet({
  mode,
  open,
  room,
  onOpenChange,
}: InventoryRoomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[390px] p-0 sm:max-w-[390px]" side="right" showCloseButton>
        <InventoryRoomForm mode={mode} onClose={() => onOpenChange(false)} room={room} />
      </SheetContent>
    </Sheet>
  );
}
