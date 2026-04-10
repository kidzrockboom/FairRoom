import { cn } from "@/lib/utils";

type NotifStatus = "delivered" | "pending";
type NotifItem  = { channel: string; status: NotifStatus };

const NOTIFICATIONS: NotifItem[] = [
  { channel: "Email", status: "delivered" },
  { channel: "Push",  status: "delivered" },
  { channel: "SMS",   status: "pending"   },
];

const STATUS_STYLES: Record<NotifStatus, string> = {
  delivered: "text-success",
  pending:   "text-warning",
};

const STATUS_LABELS: Record<NotifStatus, string> = {
  delivered: "Delivered",
  pending:   "Pending",
};

export default function NotificationHistory() {
  return (
    <div className="flex flex-col gap-2.5 px-6 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Notification History
      </p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {NOTIFICATIONS.map(({ channel, status }) => (
          <div key={channel} className="flex items-center gap-2 text-[15px]">
            <span className="text-muted-foreground">{channel}</span>
            <span className={cn("font-semibold", STATUS_STYLES[status])}>
              {STATUS_LABELS[status]}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-muted-foreground">
        Note: SMS reminders may take up to 5 minutes to deliver depending on your carrier.
      </p>
    </div>
  );
}
