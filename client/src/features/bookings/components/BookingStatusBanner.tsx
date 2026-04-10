import { CheckCircle, X, iconProps } from "@/lib/icons";

export default function BookingStatusBanner() {
  return (
    <div className="flex items-start gap-3 rounded-card border border-success/30 bg-success-subtle px-4 py-3.5">
      <CheckCircle
        {...iconProps}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-success"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-content">Booking Successfully Cancelled</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your reservation for &lsquo;Seminar Room B&rsquo; has been removed. No strike was issued
          as you cancelled within the 24-hour window.
        </p>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        className="shrink-0 text-muted-foreground transition-colors hover:text-content"
      >
        <X size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
