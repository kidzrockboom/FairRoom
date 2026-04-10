import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { AnalyticsBarItem } from "@/features/admin/analytics/content";

type AnalyticsUsageDistributionProps = {
  chart: {
    title: string;
    subtitle: string;
    groupLabel: string;
    bars: readonly AnalyticsBarItem[];
    yAxis: readonly number[];
  };
};

export default function AnalyticsUsageDistribution({
  chart,
}: AnalyticsUsageDistributionProps) {
  const maxHours = Math.max(...chart.bars.map((item) => item.hours), 1);

  return (
    <Card className="border-0 bg-surface shadow-none ring-1 ring-border/40">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 py-4">
        <div className="space-y-1">
          <CardTitle className="font-heading text-[18px] font-bold tracking-tight text-content">
            {chart.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{chart.subtitle}</p>
        </div>

        <Badge
          variant="outline"
          className="rounded-full border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-none"
        >
          {chart.groupLabel}
        </Badge>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <div className="grid gap-4 xl:grid-cols-[44px_minmax(0,1fr)]">
          <div className="flex h-[240px] flex-col justify-between py-1 text-[11px] text-muted-foreground">
            {chart.yAxis.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>

          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-px bg-border/40" />
            <div className="grid h-[240px] grid-cols-7 items-end gap-3 border-b border-border/40 pb-6">
              {chart.bars.map((bar) => {
                const height = `${(bar.hours / maxHours) * 186}px`;

                return (
                  <div
                    key={bar.room}
                    className="flex h-full flex-col items-center justify-end gap-2"
                  >
                    <div className="flex w-full flex-1 items-end justify-center">
                      <div
                        aria-label={`${bar.room} ${bar.hours} hours`}
                        className={cn(
                          "w-full max-w-[54px] rounded-t-md bg-content",
                          "shadow-[0_0_0_1px_rgba(0,0,0,0.02)]",
                        )}
                        style={{ height }}
                      />
                    </div>
                    <span className="text-center text-[11px] text-muted-foreground">{bar.room}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
