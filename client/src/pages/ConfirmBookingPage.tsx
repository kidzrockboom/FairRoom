import { ChevronLeft, iconProps } from "@/lib/icons";
import { Link } from "react-router-dom";
import ConfirmBookingSummary from "@/features/bookings/components/ConfirmBookingSummary";
import BookingFormFields from "@/features/bookings/components/BookingFormFields";
import BookingPolicyReminder from "@/features/bookings/components/BookingPolicyReminder";
import BookingActionRow from "@/features/bookings/components/BookingActionRow";

export default function ConfirmBookingPage() {
  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-0">
      <Link
        to="/rooms/room_01"
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
          Please review the details below to finalize your reservation.
        </p>
      </header>

      <ConfirmBookingSummary />

      <BookingFormFields />

      <BookingPolicyReminder />

      <BookingActionRow />
    </div>
  );
}
