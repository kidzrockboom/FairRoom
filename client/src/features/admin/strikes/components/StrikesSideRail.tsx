import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, iconProps, ShieldAlert } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { strikeEmptyState, strikePolicyItems } from "../content";
import type { StrikeHistoryRowViewModel } from "../strikesMappers";

const HISTORY_BADGE_CLASSES = {
  added: "border-destructive/20 bg-destructive/10 text-destructive",
  revoked: "border-border bg-surface text-muted-foreground",
} as const;

type StrikesSideRailProps = {
  history: StrikeHistoryRowViewModel[];
  isLoading: boolean;
};

export default function StrikesSideRail({ history, isLoading }: StrikesSideRailProps) {
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
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading strike history...</p>
          ) : history.length === 0 ? (
            <div className="rounded-card bg-muted/10 px-4 py-4 text-sm text-muted-foreground ring-1 ring-border/40">
              <p className="font-semibold text-content">{strikeEmptyState.title}</p>
              <p className="mt-1">{strikeEmptyState.description}</p>
            </div>
          ) : (
            <div className="rounded-card bg-muted/10 ring-1 ring-border/40">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "grid gap-2 px-4 py-3",
                    index !== history.length - 1 && "border-b border-border/50",
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
          )}
        </CardContent>
      </Card>

      <Card className="border-0 bg-surface shadow-none ring-1 ring-border/40">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-sm font-semibold text-content">Strike Policy Quick-Ref</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            {strikePolicyItems.map((item) => (
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
