import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { InventoryRoom } from "@/features/admin/inventory/content";

type InventoryDeleteDialogProps = {
  open: boolean;
  room?: InventoryRoom | null;
  onOpenChange: (open: boolean) => void;
};

export default function InventoryDeleteDialog({
  open,
  room,
  onOpenChange,
}: InventoryDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete room?</AlertDialogTitle>
          <AlertDialogDescription>
            {room ? `${room.name} will be removed from the inventory.` : "This room will be removed from the inventory."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" size="default">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            size="default"
            onClick={() => onOpenChange(false)}
          >
            Delete Room
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
