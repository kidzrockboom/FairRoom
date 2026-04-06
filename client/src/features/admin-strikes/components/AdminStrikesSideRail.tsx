import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, iconProps, ShieldAlert } from "@/lib/icons";

import { cn } from "@/lib/utils";

const HISTORY_BADGE_CLASSES = {
  added: "border-destructive/20 bg-destructive/10 text-destructive",
  cleared: "border-border bg-surface text-muted-foreground",
} as const;

const HISTORY = [
  {
    id: "history-1",
    title: "Strike Added",
    description: "Booking #FA-2931 - No show.",
    date: "2023-10-16",
    badge: "added",
  },
  {
    id: "history-2",
    title: "Strike Cleared",
    description: "Annual strike reset period.",
    date: "2023-10-17",
    badge: "cleared",
  },
] as const;

const POLICY_ITEMS = [
  "3 strikes result in automatic account suspension for 14 days.",
  "Strikes can be appealed by students within 48 hours.",
  "Manual overrides must include a valid reason for auditing purposes.",
  "Strikes expire after 180 days of clean booking history.",
] as const;

export default function AdminStrikesSideRail() {
  return (
    <div className="flex h-full flex-col gap-4 self-stretch">
      <Card className="gap-0 border-0 bg-surface shadow-none ring-1 ring-border/40">
        <CardHeader className="px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-content">
            <Clock {...iconProps} aria-hidden="true" className="text-muted-foreground" />
            Strike History
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="rounded-card bg-muted/10 ring-1 ring-border/40">
            {HISTORY.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "grid gap-2 px-4 py-3",
                  index !== HISTORY.length - 1 && "border-b border-border/50",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-content">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-none",
                      HISTORY_BADGE_CLASSES[item.badge],
                    )}
                  >
                    {item.badge === "added" ? "Incident" : "Completed"}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldAlert {...iconProps} aria-hidden="true" className="text-muted-foreground" />
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 bg-surface shadow-none ring-1 ring-border/40">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm font-semibold text-content">Strike Policy Quick-Ref</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            {POLICY_ITEMS.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="mt-1 text-[10px]">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
