import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { AnalyticsKpi } from "@/features/admin-analytics/adminAnalyticsContent";

type AnalyticsKpiGridProps = {
  items: AnalyticsKpi[];
};

function AnalyticsKpiCard({ item }: { item: AnalyticsKpi }) {
  const Icon = item.icon as LucideIcon;

  return (
    <Card className="border-0 bg-surface shadow-none ring-1 ring-border/40">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-4 py-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {item.label}
          </p>
          <CardTitle className="font-heading text-[14px] font-bold tracking-tight text-content">
            {item.value}
          </CardTitle>
        </div>

        <div className="flex size-9 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
          <Icon aria-hidden="true" size={16} strokeWidth={1.6} />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <p className="text-sm text-muted-foreground">{item.note}</p>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsKpiGrid({ items }: AnalyticsKpiGridProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-3")}>
      {items.map((item) => (
        <AnalyticsKpiCard key={item.label} item={item} />
      ))}
    </div>
  );
}
