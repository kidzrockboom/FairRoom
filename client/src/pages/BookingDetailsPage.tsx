import { Navigate, useParams } from "react-router-dom";
import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import BookingDetailsActions from "@/features/bookings/components/BookingDetailsActions";
import BookingDetailsHero from "@/features/bookings/components/BookingDetailsHero";
import BookingDetailsInstructions from "@/features/bookings/components/BookingDetailsInstructions";
import BookingDetailsSummaryRow from "@/features/bookings/components/BookingDetailsSummaryRow";
import { useBookingDetails } from "@/features/bookings/hooks/useBookingDetails";

function BookingDetailsContent({ bookingId }: { bookingId: string }) {
  const { bookingError, isLoading, retry, viewModel } = useBookingDetails(bookingId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loading size="lg" message="Loading booking details..." />
      </div>
    );
  }

  if (bookingError || !viewModel) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
        <ErrorBlock message={bookingError ?? "Booking not found"} onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full overflow-hidden rounded-card border border-border bg-surface">
        <BookingDetailsHero
          roomName={viewModel.roomName}
          countdownLabel={viewModel.countdownLabel}
        />

        <Separator />

        <BookingDetailsSummaryRow
          location={viewModel.location}
          scheduleLabel={viewModel.scheduleLabel}
        />

        <BookingDetailsInstructions
          bookingStatusLabel={viewModel.bookingStatusLabel}
          checkInDeadlineLabel={viewModel.checkInDeadlineLabel}
        />

        <Separator />

        <BookingDetailsActions />
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

export default function BookingDetailsPage() {
  const { bookingId } = useParams<{ bookingId: string }>();

  if (!bookingId) {
    return <Navigate to="/bookings" replace />;
  }

  return <BookingDetailsContent bookingId={bookingId} />;
}
