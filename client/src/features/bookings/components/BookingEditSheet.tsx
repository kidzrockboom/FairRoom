import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatHour } from "@/lib/utils";
import { Calendar as CalendarIcon, iconProps } from "@/lib/icons";
import SlotButton, { type TimeSlot } from "@/features/search-rooms/components/SlotButton";
import { updateMyBooking } from "../myBookingsService";
import type { BookingListItemViewModel } from "../myBookingsMappers";

type BookingEditSheetProps = {
  booking: BookingListItemViewModel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
};

const SLOT_START = 8;
const SLOT_END = 22;

function toDateInputValue(value: string): string {
  return value.slice(0, 10);
}

function toHourValue(value: string): number {
  return new Date(value).getUTCHours();
}

function toIsoDate(day: Date): string {
  return [
    day.getFullYear(),
    String(day.getMonth() + 1).padStart(2, "0"),
    String(day.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDisplayDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookingEditSheet({
  booking,
  open,
  onOpenChange,
  onUpdated,
}: BookingEditSheetProps) {
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(booking.startsAt));
  const [selectedHour, setSelectedHour] = useState<number>(toHourValue(booking.startsAt));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedDate(toDateInputValue(booking.startsAt));
      setSelectedHour(toHourValue(booking.startsAt));
      setError(null);
    }
  }, [booking.startsAt, open]);

  const calendarDate = useMemo(() => new Date(`${selectedDate}T00:00:00`), [selectedDate]);

  const slots = useMemo<TimeSlot[]>(
    () =>
      Array.from({ length: SLOT_END - SLOT_START }, (_, index) => {
        const hour = SLOT_START + index;
        return {
          time: formatHour(hour),
          status: hour === selectedHour ? "selected" : "available",
        };
      }),
    [selectedHour],
  );

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const startsAt = `${selectedDate}T${String(selectedHour).padStart(2, "0")}:00:00`;
      const endsAt = `${selectedDate}T${String(selectedHour + 1).padStart(2, "0")}:00:00`;

      await updateMyBooking(booking.id, { startsAt, endsAt });
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
      <SheetContent side="right" className="w-[420px] p-0 sm:max-w-[420px]">
        <SheetHeader className="border-b border-border bg-muted/25 p-4">
          <SheetTitle>Edit booking</SheetTitle>
          <SheetDescription>Choose a new date and one-hour slot for {booking.roomName}.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-5 px-4 py-4">
          <div className="grid gap-2">
            <span className="text-sm font-medium text-content">Booking date</span>
            <Popover>
              <PopoverTrigger
                className="flex h-10 items-center gap-2 rounded-input border border-input bg-surface px-3 text-sm text-content transition-colors hover:bg-muted/40"
              >
                <CalendarIcon {...iconProps} aria-hidden="true" className="text-muted-foreground" />
                {formatDisplayDate(selectedDate)}
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={calendarDate}
                  defaultMonth={calendarDate}
                  onSelect={(day) => {
                    if (day) {
                      setSelectedDate(toIsoDate(day));
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-medium text-content">Start time</span>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((slot, index) => {
                const hour = SLOT_START + index;
                return (
                  <SlotButton
                    key={slot.time}
                    slot={slot}
                    onClick={() => setSelectedHour(hour)}
                  />
                );
              })}
            </div>
          </div>

          <div className="rounded-card border border-primary/30 bg-primary/5 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/70">
              Selected booking
            </p>
            <p className="mt-1 text-sm font-semibold text-primary">
              {formatDisplayDate(selectedDate)} · {formatHour(selectedHour)} – {formatHour(selectedHour + 1)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Duration: 1 hour</p>
          </div>

          {error && (
            <p className="rounded-card border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <SheetFooter className="border-t border-border bg-surface">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
