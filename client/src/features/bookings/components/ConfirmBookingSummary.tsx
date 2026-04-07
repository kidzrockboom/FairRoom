import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, iconProps } from "@/lib/icons";
import { useConfirmBookingContext } from "@/features/confirm-booking/context";
import { formatBookingDate, formatSlotRange } from "@/features/confirm-booking/mappers";

export default function ConfirmBookingSummary() {
  const { room, date, slotHour } = useConfirmBookingContext();

  if (!room) return null;

  return (
    <section className="overflow-hidden rounded-card border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/35 px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Reservation Summary
        </p>
        <Badge className="rounded-full bg-muted/75 px-2.5 py-0.5 text-[11px] font-semibold text-content shadow-none">
          Pending Confirmation
        </Badge>
      </div>

      <div className="grid gap-5 px-4 py-4 md:grid-cols-2 md:items-center md:gap-6 md:px-5 md:py-5">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-sidebar/70">
              <MapPin {...iconProps} aria-hidden="true" className="text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-content">{room.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{room.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-sidebar/70">
              <Calendar {...iconProps} aria-hidden="true" className="text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-content">{formatBookingDate(date)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1.5">
                <Users {...iconProps} aria-hidden="true" className="text-muted-foreground" />
                Capacity: {room.capacity} {room.capacity === 1 ? "Person" : "Persons"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-5 text-center">
          <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock {...iconProps} aria-hidden="true" />
          </div>
          <p className="mt-3 text-[22px] font-bold leading-tight text-primary">
            {formatSlotRange(slotHour)}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary/70">
            Duration: 1 Hour
          </p>
        </div>
      </div>
    </section>
  );
}
