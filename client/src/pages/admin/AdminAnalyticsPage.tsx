import {
  analyticsChart,
  analyticsHeader,
  analyticsInsights,
  analyticsKpis,
  analyticsPerformance,
} from "@/features/admin-analytics/adminAnalyticsContent";
import AnalyticsKpiGrid from "@/features/admin-analytics/components/AnalyticsKpiGrid";
import AnalyticsPerformanceTable from "@/features/admin-analytics/components/AnalyticsPerformanceTable";
import AnalyticsSystemInsights from "@/features/admin-analytics/components/AnalyticsSystemInsights";
import AnalyticsUsageDistribution from "@/features/admin-analytics/components/AnalyticsUsageDistribution";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter, Info, iconProps } from "@/lib/icons";

function AdminAnalyticsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
            {analyticsHeader.title}
          </h1>
          <p className="max-w-[520px] text-sm text-muted-foreground">
            {analyticsHeader.subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-2 xl:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full border-border bg-surface px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-none"
            >
              <Info {...iconProps} aria-hidden="true" />
              {analyticsHeader.inlineNote}
            </Badge>

            <Button variant="outline" className="h-9 gap-2 px-3 text-sm font-semibold shadow-none">
              <Calendar data-icon="inline-start" />
              {analyticsHeader.dateRangeLabel}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="h-9 gap-2 px-3 text-sm font-semibold shadow-none">
              <Filter data-icon="inline-start" />
              Filters
            </Button>
            <Button className="h-9 gap-2 px-3 text-sm font-semibold">
              <Download data-icon="inline-start" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <AnalyticsKpiGrid items={analyticsKpis} />

      <AnalyticsUsageDistribution chart={analyticsChart} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <AnalyticsPerformanceTable performance={analyticsPerformance} />
        <AnalyticsSystemInsights insights={analyticsInsights} />
      </div>
    </div>
  );
}

export default AdminAnalyticsPage;
