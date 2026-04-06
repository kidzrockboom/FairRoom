import { Users } from "@/lib/icons";
import { iconProps } from "@/lib/icons";

const PURPOSE_PLACEHOLDER = "e.g., Final Exam Group Study, Project Coordination...";

export default function BookingFormFields() {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="booking-purpose" className="text-sm font-semibold text-content">
          Purpose of Booking
        </label>
        <textarea
          id="booking-purpose"
          rows={4}
          defaultValue=""
          placeholder={PURPOSE_PLACEHOLDER}
          className="min-h-28 w-full rounded-card border border-border bg-surface px-4 py-3 text-sm text-content placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        <p className="text-xs text-muted-foreground">Briefly describe what the room will be used for.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="expected-attendees" className="text-sm font-semibold text-content">
          Expected Attendees
        </label>
        <div className="relative max-w-[160px]">
          <Users
            {...iconProps}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id="expected-attendees"
            type="number"
            defaultValue={2}
            min={1}
            max={6}
            className="h-10 w-full rounded-card border border-border bg-surface pl-9 pr-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
        <p className="text-xs text-muted-foreground">Maximum capacity for this room is 6.</p>
      </div>
    </section>
  );
}
