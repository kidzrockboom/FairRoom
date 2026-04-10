import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info, iconProps } from "@/lib/icons";

type ReminderActionsProps = {
  roomId: string;
  directionsHref: string;
};

export default function ReminderActions({ roomId, directionsHref }: ReminderActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info {...iconProps} aria-hidden="true" className="shrink-0" />
        Need to Leave? You have 5 minutes left to avoid penalties.
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-sm"
          type="button"
          onClick={() => window.open(directionsHref, "_blank", "noreferrer")}
        >
          Get Directions
        </Button>
        <Link
          to={`/rooms/${roomId}`}
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded border border-transparent bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          View Details
          <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
