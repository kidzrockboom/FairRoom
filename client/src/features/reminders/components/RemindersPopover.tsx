import { useNavigate } from "react-router-dom";
import type { Reminder } from "@/api/contracts";
import Loading from "@/components/ui/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock, XCircle, iconProps } from "@/lib/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  formatReminderChannel,
  formatReminderDate,
  formatReminderStatus,
  getReminderDetail,
  getReminderStatusBadgeClassName,
  getReminderSummary,
} from "../remindersMappers";
import { useRemindersDropdown } from "../hooks/useRemindersDropdown";

function getReminderIconClassName(status: Reminder["status"]) {
  if (status === "failed") {
    return "text-red-600";
  }

  if (status === "delivered") {
    return "text-emerald-600";
  }

  return "text-muted-foreground";
}

function ReminderStatusIcon({ status }: { status: Reminder["status"] }) {
  if (status === "failed") {
    return <XCircle {...iconProps} aria-hidden="true" className={getReminderIconClassName(status)} />;
  }

  if (status === "delivered") {
    return (
      <CheckCircle {...iconProps} aria-hidden="true" className={getReminderIconClassName(status)} />
    );
  }

  return <Clock {...iconProps} aria-hidden="true" className={getReminderIconClassName(status)} />;
}

export default function RemindersPopover() {
  const navigate = useNavigate();
  const { error, isLoading, open, reminders, setOpen } = useRemindersDropdown();
  const reminderCount = reminders.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="hidden rounded-full p-2 text-muted-foreground outline-none transition-colors hover:bg-muted/70 hover:text-content focus-visible:bg-muted/70 sm:inline-flex"
        aria-label="Open reminders"
      >
        <Bell {...iconProps} aria-hidden="true" />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[24rem] p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-content">Reminders</h3>
            <p className="text-xs text-muted-foreground">Recent reminders from your bookings</p>
          </div>

          <Badge className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
            {reminderCount}
          </Badge>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-8">
              <Loading className="py-2" message="Loading reminders" size="sm" />
            </div>
          ) : error ? (
            <div className="px-4 py-6">
              <h4 className="text-sm font-semibold text-content">Unable to load reminders</h4>
              <p className="mt-1 text-xs text-muted-foreground">{error}</p>
            </div>
          ) : reminderCount === 0 ? (
            <div className="px-4 py-6">
              <h4 className="text-sm font-semibold text-content">No reminders yet.</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                You&apos;ll see email, push, and SMS reminders here when they are generated.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {reminders.map((reminder) => (
                <li key={reminder.id}>
                  <button
                    className="flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors hover:bg-muted/50"
                    onClick={() => {
                      setOpen(false);
                      navigate(`/bookings/${reminder.bookingId}`);
                    }}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-muted p-2">
                          <ReminderStatusIcon status={reminder.status} />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="truncate text-sm font-semibold text-content">
                              {formatReminderChannel(reminder.channel)} reminder
                            </h4>
                            <Badge
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getReminderStatusBadgeClassName(
                                reminder.status,
                              )}`}
                            >
                              {formatReminderStatus(reminder.status)}
                            </Badge>
                          </div>

                          <p className="text-sm leading-6 text-muted-foreground">
                            {getReminderSummary(reminder)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>{getReminderDetail(reminder)}</span>
                      <span>{formatReminderDate(reminder.createdAt)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-3">
          <Button
            className="w-full"
            onClick={() => {
              setOpen(false);
              navigate("/bookings");
            }}
            variant="outline"
          >
            View bookings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
