import { Info, iconProps } from "@/lib/icons";

type CheckInInstructionsProps = {
  checkInDeadlineLabel: string;
};

export default function CheckInInstructions({
  checkInDeadlineLabel,
}: CheckInInstructionsProps) {
  return (
    <div className="mx-6 my-0.5 rounded-lg border border-border bg-sidebar/50 px-4 py-4">
      <div className="flex items-center gap-2">
        <Info {...iconProps} aria-hidden="true" className="shrink-0 text-muted-foreground" />
        <span className="text-[15px] font-semibold text-content">Check-in Instructions</span>
      </div>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
        Please arrive on time. You must scan the QR code located on the pod door within
        15 minutes of your start time (by {checkInDeadlineLabel}). Failure to check in will result in
        automatic cancellation and a strike on your account.
      </p>
    </div>
  );
}
