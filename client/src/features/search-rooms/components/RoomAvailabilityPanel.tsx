import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Calendar as CalendarIcon, CheckCircle, Clock, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useRoomDetailsContext } from "@/features/room-details/context";
import SlotButton, { type TimeSlot } from "./SlotButton";

function formatDisplayDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
}

export default function RoomAvailabilityPanel() {
  const {
    room,
    slots,
    selectedSlotIndex,
    selectedSlot,
    date,
    isLoadingBookings,
    selectSlot,
    setDate,
  } = useRoomDetailsContext();

  const calendarDate = new Date(date + "T00:00:00");

  const handleCalendarSelect = (day: Date | undefined) => {
    if (day) {
      const iso = [
        day.getFullYear(),
        String(day.getMonth() + 1).padStart(2, "0"),
        String(day.getDate()).padStart(2, "0"),
      ].join("-");
      setDate(iso);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-content">Room Availability</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select an available time slot below to start your booking process.
          </p>
        </div>

        <Popover>
          <PopoverTrigger
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-border bg-sidebar/65 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-content",
            )}
          >
            <CalendarIcon {...iconProps} aria-hidden="true" />
            {formatDisplayDate(date)}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={handleCalendarSelect}
              defaultMonth={calendarDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      {isLoadingBookings ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-lg border border-border bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {slots.map((slot, index) => {
            const displaySlot: TimeSlot =
              index === selectedSlotIndex ? { ...slot, status: "selected" } : slot;

            return (
              <SlotButton
                key={slot.time}
                slot={displaySlot}
                onClick={slot.status === "available" ? () => selectSlot(index === selectedSlotIndex ? null : index) : undefined}
              />
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-content">Your Selection</h3>

        {selectedSlot ? (
          <div className="flex items-center justify-between gap-3 rounded-card border border-primary/30 bg-primary/5 px-4 py-3.5">
            <div>
              <p className="text-sm font-bold text-primary">Single Hour Booking</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {formatDisplayDate(date)} &bull; {selectedSlot.time}
              </p>
            </div>
            <Badge className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              Free for Students
            </Badge>
          </div>
        ) : (
          <div className="rounded-card border border-border bg-sidebar/65 px-4 py-3.5 text-center text-sm text-muted-foreground">
            Select a time slot above to see your booking summary.
          </div>
        )}

        <div className="flex gap-3 rounded-card border border-warning/40 bg-warning/10 px-4 py-3.5">
          <AlertTriangle
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-warning"
          />
          <div>
            <p className="text-sm font-bold text-warning">Important Strike Policy</p>
            <p className="mt-0.5 text-sm text-warning/80">
              Failing to check in within 15 minutes of your booking start time will result in a{" "}
              <strong>strike</strong>. 3 strikes will lead to a 14-day booking suspension.
            </p>
          </div>
        </div>
      </div>

      {selectedSlot && room ? (
        <Link
          to="/bookings/confirm"
          state={{ roomId: room.id, date, slotTime: selectedSlot.time }}
          className={buttonVariants({
            variant: "default",
            size: "default",
            className: "h-12 w-full text-base font-semibold",
          })}
        >
          Book This Room
        </Link>
      ) : (
        <Button disabled className="h-12 w-full text-base font-semibold">
          Book This Room
        </Button>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-card border border-border bg-sidebar/65 p-4 text-center">
          <CheckCircle size={28} strokeWidth={1.5} aria-hidden="true" className="text-muted-foreground" />
          <p className="text-sm font-semibold text-content">Instant Confirmation</p>
          <p className="text-xs text-muted-foreground">No admin approval required</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-card border border-border bg-sidebar/65 p-4 text-center">
          <Clock size={28} strokeWidth={1.5} aria-hidden="true" className="text-muted-foreground" />
          <p className="text-sm font-semibold text-content">4-Hour Max Limit</p>
          <p className="text-xs text-muted-foreground">Per student per day</p>
        </div>
      </div>
    </div>
  );
}
