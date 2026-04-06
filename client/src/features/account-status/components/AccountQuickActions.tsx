import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Search, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

type QuickAction = {
  to: string;
  title: string;
  description: string;
  Icon: typeof Search;
  accentClassName: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    to: "/search",
    title: "Find a Room",
    description: "Browse available spaces",
    Icon: Search,
    accentClassName: "bg-brand-50 text-brand-500",
  },
  {
    to: "/bookings",
    title: "My Bookings",
    description: "Manage active reservations",
    Icon: Calendar,
    accentClassName: "bg-muted/60 text-content",
  },
];

export default function AccountQuickActions() {
  return (
    <section className="grid gap-3 md:grid-cols-2">
      {QUICK_ACTIONS.map(({ to, title, description, Icon, accentClassName }) => (
        <Link
          key={to}
          to={to}
          className={cn(
            "flex items-center justify-between rounded-card border border-border bg-surface px-4 py-4 transition-colors hover:border-brand-200 hover:bg-brand-50/20",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn("flex size-8 shrink-0 items-center justify-center rounded-md", accentClassName)}
            >
              <Icon {...iconProps} aria-hidden="true" className="size-[17px]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-content">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>

          <ChevronRight {...iconProps} aria-hidden="true" className="shrink-0 text-muted-foreground" />
        </Link>
      ))}
    </section>
  );
}
