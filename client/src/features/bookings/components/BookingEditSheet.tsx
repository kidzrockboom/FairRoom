import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { updateMyBooking } from "../myBookingsService";
import type { BookingListItemViewModel } from "../myBookingsMappers";

type BookingEditSheetProps = {
  booking: BookingListItemViewModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
};

function toDateTimeLocalValue(value: string): string {
  return value.slice(0, 16);
}

function toNaiveDateTime(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

export default function BookingEditSheet({
  booking,
  open,
  onOpenChange,
  onUpdated,
}: BookingEditSheetProps) {
  const [startsAt, setStartsAt] = useState(toDateTimeLocalValue(booking.startsAt));
  const [endsAt, setEndsAt] = useState(toDateTimeLocalValue(booking.endsAt));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setStartsAt(toDateTimeLocalValue(booking.startsAt));
      setEndsAt(toDateTimeLocalValue(booking.endsAt));
      setError(null);
    }
  }, [booking.endsAt, booking.startsAt, open]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await updateMyBooking(booking.id, {
        startsAt: toNaiveDateTime(startsAt),
        endsAt: toNaiveDateTime(endsAt),
      });
      onOpenChange(false);
      onUpdated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "We could not update this booking.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit booking</SheetTitle>
          <SheetDescription>Update the booking time for {booking.roomName}.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 px-4">
          <label className="grid gap-2 text-sm">
            <span className="font-medium text-content">Start time</span>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              className="h-10 rounded-input border border-input bg-surface px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="font-medium text-content">End time</span>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
              className="h-10 rounded-input border border-input bg-surface px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </label>

          {error && (
            <p className="rounded-card border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
