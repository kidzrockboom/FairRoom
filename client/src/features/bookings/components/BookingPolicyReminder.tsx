import { Info, iconProps } from "@/lib/icons";

export default function BookingPolicyReminder() {
  return (
    <section className="rounded-card border border-border bg-sidebar/50 px-4 py-4">
      <div className="flex items-center gap-2">
        <Info {...iconProps} aria-hidden="true" className="shrink-0 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-content">FairRoom Policy Reminder</h2>
      </div>

      <ul className="mt-3 space-y-1.5 pl-1 text-sm text-muted-foreground">
        <li>• Failure to show up within 15 minutes of start time results in 1 strike.</li>
        <li>• Leaving the room in a messy state results in 1 strike.</li>
        <li>• Accumulating 3 strikes will suspend your booking privileges for 30 days.</li>
      </ul>
    </section>
  );
}
