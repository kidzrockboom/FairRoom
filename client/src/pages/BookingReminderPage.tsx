import { Navigate, useLocation } from "react-router-dom";
import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import type { BookingReminderRouterState } from "@/features/bookings/hooks/useBookingReminder";
import { useBookingReminder } from "@/features/bookings/hooks/useBookingReminder";
import CheckInInstructions from "@/features/bookings/components/CheckInInstructions";
import NotificationHistory from "@/features/bookings/components/NotificationHistory";
import ReminderActions from "@/features/bookings/components/ReminderActions";
import ReminderHero from "@/features/bookings/components/ReminderHero";
import ReminderSummaryRow from "@/features/bookings/components/ReminderSummaryRow";

function isBookingReminderState(state: unknown): state is BookingReminderRouterState {
  return (
    typeof state === "object" &&
    state !== null &&
    typeof (state as BookingReminderRouterState).booking === "object" &&
    (state as BookingReminderRouterState).booking !== null &&
    typeof (state as BookingReminderRouterState).booking.id === "string" &&
    typeof (state as BookingReminderRouterState).booking.roomId === "string"
  );
}

function BookingReminderContent({ booking }: BookingReminderRouterState) {
  const { isLoading, roomError, retry, viewModel } = useBookingReminder(booking);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loading size="lg" message="Loading reminder details..." />
      </div>
    );
  }

  if (roomError || !viewModel) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
        <ErrorBlock message={roomError ?? "Reminder not found"} onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full overflow-hidden rounded-card border border-border bg-surface">
        <ReminderHero
          roomName={viewModel.roomName}
          countdownLabel={viewModel.countdownLabel}
        />

        <Separator />

        <ReminderSummaryRow
          location={viewModel.location}
          scheduleLabel={viewModel.scheduleLabel}
        />

        <CheckInInstructions checkInDeadlineLabel={viewModel.checkInDeadlineLabel} />

        <NotificationHistory reminders={viewModel.reminders} />

        <Separator />

        <ReminderActions
          roomId={booking.roomId}
          directionsHref={viewModel.directionsHref}
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <a href="#" className="transition-colors hover:text-content">
          Help Center
        </a>
        <span aria-hidden="true">·</span>
        <a href="#" className="transition-colors hover:text-content">
          Booking Policies
        </a>
        <span aria-hidden="true">·</span>
        <a href="#" className="transition-colors hover:text-content">
          Report an Issue
        </a>
      </div>
    </div>
  );
}

export default function BookingReminderPage() {
  const { state } = useLocation();

  if (!isBookingReminderState(state)) {
    return <Navigate to="/bookings" replace />;
  }

  return <BookingReminderContent booking={state.booking} />;
}
