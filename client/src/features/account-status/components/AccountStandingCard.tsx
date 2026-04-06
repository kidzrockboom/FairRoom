import { Badge } from "@/components/ui/badge";
import { ShieldAlert, iconProps } from "@/lib/icons";

type AccountStandingCardProps = {
  strikeCount: number;
  maxStrikes: number;
  standingLabel: string;
  standingMessage: string;
};

export default function AccountStandingCard({
  strikeCount,
  maxStrikes,
  standingLabel,
  standingMessage,
}: AccountStandingCardProps) {
  return (
    <section className="rounded-card border border-border bg-surface">
      <div className="grid gap-6 px-6 py-6 md:grid-cols-[190px_minmax(0,1fr)] md:items-center md:px-7 md:py-7">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2.5">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <ShieldAlert {...iconProps} aria-hidden="true" className="size-5" />
            </div>
            <div className="flex size-11 items-center justify-center rounded-full bg-muted/70 text-sm font-semibold text-content">
              2
            </div>
            <div className="flex size-11 items-center justify-center rounded-full bg-muted/70 text-sm font-semibold text-content">
              3
            </div>
          </div>

          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Strike Count: {strikeCount} / {maxStrikes}
          </p>
        </div>

        <div className="space-y-3">
          <Badge className="rounded-full px-3 py-1 text-[11px] font-semibold shadow-none">
            {standingLabel}
          </Badge>
          <h2 className="font-heading text-[25px] font-bold leading-tight text-content">
            {standingMessage}
          </h2>
          <p className="max-w-[44ch] text-sm leading-6 text-muted-foreground">
            Continue following the fair use policy to maintain access to all campus study rooms and
            facilities.
          </p>
        </div>
      </div>
    </section>
  );
}
