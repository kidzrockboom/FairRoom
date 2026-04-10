import { Sheet, SheetContent } from "@/components/ui/sheet";

import InventoryRoomForm from "@/features/admin/inventory/components/InventoryRoomForm";
import type { AdminRoomResponse, AmenityResponse } from "@/api/contracts";
import type { InventoryRoomFormValues } from "@/features/admin/inventory/schemas";

type InventoryRoomSheetProps = {
  mode: "add" | "edit";
  open: boolean;
  room?: AdminRoomResponse | null;
  amenityOptions: AmenityResponse[];
  error: string | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onCreateAmenity: (label: string) => Promise<AmenityResponse>;
  onSubmit: (values: InventoryRoomFormValues) => Promise<void>;
  onOpenChange: (open: boolean) => void;
};

export default function InventoryRoomSheet({
  mode,
  open,
  room,
  amenityOptions,
  error,
  isSubmitting,
  onCancel,
  onCreateAmenity,
  onSubmit,
  onOpenChange,
}: InventoryRoomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[390px] p-0 sm:max-w-[390px]" side="right" showCloseButton>
        <InventoryRoomForm
          key={`${mode}:${room?.id ?? "new"}`}
          amenityOptions={amenityOptions}
          error={error}
          isSubmitting={isSubmitting}
          mode={mode}
          onCancel={onCancel}
          onCreateAmenity={onCreateAmenity}
          onSubmit={onSubmit}
          room={room}
        />
      </SheetContent>
    </Sheet>
  );
}
