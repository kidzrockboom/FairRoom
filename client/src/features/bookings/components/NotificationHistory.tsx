import { cn } from "@/lib/utils";
import type { ReminderRowViewModel } from "../mappers";

type NotificationHistoryProps = {
  reminders: ReminderRowViewModel[];
};

const TONE_STYLES: Record<"success" | "warning" | "neutral", string> = {
  success: "text-success",
  warning: "text-warning",
  neutral: "text-muted-foreground",
};

export default function NotificationHistory({ reminders }: NotificationHistoryProps) {
  return (
    <div className="flex flex-col gap-2.5 px-6 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Notification History
      </p>

      {reminders.length > 0 ? (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center gap-2 text-[15px]">
              <span className="text-muted-foreground">{reminder.channelLabel}</span>
              <span className={cn("font-semibold", TONE_STYLES[reminder.tone])}>
                {reminder.statusLabel}
              </span>
              <span className="text-xs text-muted-foreground">{reminder.detailLabel}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No reminders have been sent for this booking yet.
        </p>
      )}

      <p className="text-[13px] text-muted-foreground">
        Note: SMS reminders may take up to 5 minutes to deliver depending on your carrier.
      </p>
    </div>
  );
}
