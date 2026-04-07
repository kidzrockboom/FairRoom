import { Users, iconProps } from "@/lib/icons";
import { useConfirmBookingContext } from "@/features/confirm-booking/context";

export default function BookingFormFields() {
  const { register, errors, room } = useConfirmBookingContext();

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="purpose" className="text-sm font-semibold text-content">
          Purpose of Booking
        </label>
        <textarea
          id="purpose"
          rows={4}
          placeholder="e.g., Final Exam Group Study, Project Coordination..."
          className="min-h-28 w-full rounded-card border border-border bg-surface px-4 py-3 text-sm text-content placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/30"
          {...register("purpose")}
        />
        {errors.purpose && (
          <p className="text-xs text-destructive">{errors.purpose.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Briefly describe what the room will be used for.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="expectedAttendees" className="text-sm font-semibold text-content">
          Expected Attendees
        </label>
        <div className="relative max-w-[160px]">
          <Users
            {...iconProps}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="expectedAttendees"
            type="number"
            min={1}
            max={room?.capacity}
            className="h-10 w-full rounded-card border border-border bg-surface pl-9 pr-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/30"
            {...register("expectedAttendees", { valueAsNumber: true })}
          />
        </div>
        {errors.expectedAttendees && (
          <p className="text-xs text-destructive">{errors.expectedAttendees.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Maximum capacity for this room is {room?.capacity ?? "—"}.
        </p>
      </div>
    </section>
  );
}
