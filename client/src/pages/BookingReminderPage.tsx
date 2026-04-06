import { Separator } from "@/components/ui/separator";
import CheckInInstructions from "@/features/bookings/components/CheckInInstructions";
import NotificationHistory from "@/features/bookings/components/NotificationHistory";
import ReminderActions from "@/features/bookings/components/ReminderActions";
import ReminderHero from "@/features/bookings/components/ReminderHero";
import ReminderSummaryRow from "@/features/bookings/components/ReminderSummaryRow";

export default function BookingReminderPage() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-4 px-4 py-6 sm:px-6 lg:px-8">
      {/* Card */}
      <div className="w-full overflow-hidden rounded-card border border-border bg-surface">
        <ReminderHero />

        <Separator />

        <ReminderSummaryRow />

        <CheckInInstructions />

        <NotificationHistory />

        <Separator />

        <ReminderActions />
      </div>

      {/* Helper links */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <a href="#" className="transition-colors hover:text-content">Help Center</a>
        <span aria-hidden="true">·</span>
        <a href="#" className="transition-colors hover:text-content">Booking Policies</a>
        <span aria-hidden="true">·</span>
        <a href="#" className="transition-colors hover:text-content">Report an Issue</a>
      </div>
    </div>
  );
}
