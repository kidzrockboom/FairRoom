import { Badge } from "@/components/ui/badge";
import { Clock, iconProps } from "@/lib/icons";
import type { AccountActivityItem } from "@/api/contracts";

type RecentActivitySectionProps = {
  items: AccountActivityItem[];
};

function getStatusBadgeClassName(status: string) {
  if (status === "incident") {
    return "border-transparent bg-red-100 text-red-700 hover:bg-red-100";
  }

  if (status === "completed") {
    return "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
  }

  if (status === "cancelled") {
    return "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100";
  }

  return "border-transparent bg-muted text-muted-foreground hover:bg-muted";
}

export default function RecentActivitySection({ items }: RecentActivitySectionProps) {
  const activityItems = Array.isArray(items) ? items : [];

  const formatOccurredAt = (occurredAt: string) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(occurredAt));

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
        {activityItems.length === 0 ? (
          <div className="px-4 py-5">
            <h3 className="text-sm font-semibold text-content">No recent account activity yet.</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Account updates will appear here once your bookings or strikes create activity.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {activityItems.map((item) => (
              <li key={item.id} className="space-y-2 px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-content">{item.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>

                  <Badge
                    variant="secondary"
                    className={`rounded-full px-2.5 py-0.5 text-[11px] ${getStatusBadgeClassName(item.status)}`}
                  >
                    {item.status}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">{formatOccurredAt(item.occurredAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
