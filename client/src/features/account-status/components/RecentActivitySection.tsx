import { Clock, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

type ActivityStatus = "incident" | "completed";

type ActivityItem = {
  title: string;
  description: string;
  dateLabel: string;
  status: ActivityStatus;
};

const ACTIVITIES: ActivityItem[] = [
  {
    title: "Strike Added",
    description: "No-show for Room 402 (14:00 - 15:30)",
    dateLabel: "Oct 24, 2023",
    status: "incident",
  },
  {
    title: "Successful Booking",
    description: "Checked in for Room 101 (09:00 - 10:00)",
    dateLabel: "Oct 20, 2023",
    status: "completed",
  },
  {
    title: "Successful Booking",
    description: "Checked in for Study Pod A (16:00 - 18:00)",
    dateLabel: "Oct 15, 2023",
    status: "completed",
  },
  {
    title: "Strike Added",
    description: "Late cancellation (Room 205)",
    dateLabel: "Oct 12, 2023",
    status: "incident",
  },
];

function ActivityBadge({ status }: { status: ActivityStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        status === "incident"
          ? "border-destructive/20 bg-destructive/8 text-destructive"
          : "border-border bg-surface text-muted-foreground",
      )}
    >
      {status === "incident" ? "Incident" : "Completed"}
    </span>
  );
}

export default function RecentActivitySection() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock {...iconProps} aria-hidden="true" className="text-muted-foreground" />
          <h2 className="text-sm font-bold text-content">Recent Account Activity</h2>
        </div>

        <button type="button" className="text-xs font-medium text-muted-foreground transition-colors hover:text-content">
          View Full History
        </button>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {ACTIVITIES.map((item, index) => (
          <article
            key={`${item.title}-${item.dateLabel}`}
            className={cn(
              "grid gap-3 px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center",
              index !== ACTIVITIES.length - 1 && "border-b border-border",
            )}
          >
            <div>
              <h3 className="text-sm font-semibold text-content">{item.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
            </div>

            <div className="flex items-start gap-3 md:flex-col md:items-end md:gap-1">
              <span className="text-[11px] font-medium text-muted-foreground">{item.dateLabel}</span>
              <ActivityBadge status={item.status} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
