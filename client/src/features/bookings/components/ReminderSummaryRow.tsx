import { Clock, MapPin, iconProps } from "@/lib/icons";

export default function ReminderSummaryRow() {
  return (
    <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-y-0 px-6 py-5">
      <div className="flex items-center gap-3 py-4 md:py-0 md:pr-6">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar/70">
          <MapPin {...iconProps} aria-hidden="true" strokeWidth={2} size={17} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Location
          </p>
          <p className="mt-1 text-[15px] font-semibold text-content">Floor 5, Central Library</p>
        </div>
      </div>

      <div className="flex items-center gap-3 py-4 md:py-0 md:pl-6">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar/70">
          <Clock {...iconProps} aria-hidden="true" strokeWidth={2} size={17} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Scheduled Time
          </p>
          <p className="mt-1 text-[15px] font-semibold text-content">
            14:00 – 16:00{" "}
            <span className="font-normal text-muted-foreground">(Today)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
