import { Navigate, useLocation } from "react-router-dom";
import { ConfirmBookingProvider, useConfirmBookingContext } from "@/features/confirm-booking/context";
import type { ConfirmBookingRouterState } from "@/features/confirm-booking/hooks/useConfirmBooking";
import Loading from "@/components/ui/loading";
import ErrorBlock from "@/components/ui/error";
import { ChevronLeft, iconProps } from "@/lib/icons";
import { Link } from "react-router-dom";
import ConfirmBookingSummary from "@/features/bookings/components/ConfirmBookingSummary";
import BookingFormFields from "@/features/bookings/components/BookingFormFields";
import BookingPolicyReminder from "@/features/bookings/components/BookingPolicyReminder";
import BookingActionRow from "@/features/bookings/components/BookingActionRow";

function ConfirmBookingContent() {
  const { room, isLoadingRoom, roomError, onSubmit } = useConfirmBookingContext();

  if (isLoadingRoom) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loading size="lg" message="Loading booking details..." />
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
        <ErrorBlock message={roomError ?? "Room not found"} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        to={`/rooms/${room.id}`}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-content"
      >
        <ChevronLeft {...iconProps} aria-hidden="true" />
        Back to Room Details
      </Link>

      <header className="space-y-1">
        <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
          Confirm Your Booking
        </h1>
        <p className="text-sm text-muted-foreground">
          Please review the details below to finalise your reservation.
        </p>
      </header>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <ConfirmBookingSummary />
        <BookingFormFields />
        <BookingPolicyReminder />
        <BookingActionRow />
      </form>
    </div>
  );
}

function isValidRouterState(state: unknown): state is ConfirmBookingRouterState {
  return (
    typeof state === "object" &&
    state !== null &&
    typeof (state as ConfirmBookingRouterState).roomId === "string" &&
    typeof (state as ConfirmBookingRouterState).date === "string" &&
    typeof (state as ConfirmBookingRouterState).slotHour === "number"
  );
}

export default function ConfirmBookingPage() {
  const { state } = useLocation();

  if (!isValidRouterState(state)) {
    return <Navigate to="/search" replace />;
  }

  return (
    <ConfirmBookingProvider {...state}>
      <ConfirmBookingContent />
    </ConfirmBookingProvider>
  );
}
