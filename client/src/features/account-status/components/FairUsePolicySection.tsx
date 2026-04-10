import { AlertTriangle, Clock, Info, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

type PolicyCard = {
  title: string;
  icon: typeof AlertTriangle;
  iconClassName: string;
  body: string[];
};

const POLICY_CARDS: PolicyCard[] = [
  {
    title: "How Strikes Are Earned",
    icon: AlertTriangle,
    iconClassName: "bg-destructive/10 text-destructive",
    body: [
      "No-shows (failure to check-in within 15 mins).",
      "Cancellations with less than 2 hours' notice.",
      "Violating room capacity rules.",
    ],
  },
  {
    title: "How To Clear Strikes",
    icon: Clock,
    iconClassName: "bg-muted/60 text-muted-foreground",
    body: [
      "One strike is removed for every 5 successful bookings attended.",
      "All strikes reset at the start of each new semester.",
    ],
  },
  {
    title: "Booking Restrictions",
    icon: Info,
    iconClassName: "bg-muted/60 text-muted-foreground",
    body: [
      "Max 4 hours per day per student.",
      "Bookings can be made up to 7 days in advance.",
    ],
  },
];

export default function FairUsePolicySection() {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex size-5 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <Info {...iconProps} aria-hidden="true" className="size-[13px]" />
        </div>
        <h2 className="text-sm font-bold text-content">Fair Use Policy</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {POLICY_CARDS.map(({ title, icon: Icon, iconClassName, body }) => (
          <article key={title} className="rounded-card border border-border bg-surface p-4">
            <div className={cn("flex size-7 items-center justify-center rounded-full", iconClassName)}>
              <Icon {...iconProps} aria-hidden="true" className="size-[14px]" />
            </div>

            <h3 className="mt-3 text-[11px] font-bold uppercase tracking-[0.15em] text-content">
              {title}
            </h3>

            <ul className="mt-3 space-y-1.5 text-[12px] leading-5 text-muted-foreground">
              {body.map((line) => (
                <li key={line} className="flex gap-1.5">
                  <span aria-hidden="true">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
