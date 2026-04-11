import Empty from "@/components/ui/empty";
import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";

import AnalyticsKpiGrid from "@/features/admin/analytics/components/AnalyticsKpiGrid";
import AnalyticsUsageDistribution from "@/features/admin/analytics/components/AnalyticsUsageDistribution";
import { analyticsHeader } from "@/features/admin/analytics/content";
import { useAdminAnalytics } from "@/features/admin/analytics/hooks/useAdminAnalytics";

function AdminAnalyticsPage() {
  const { data, error, isLoading, refresh } = useAdminAnalytics();

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
          {analyticsHeader.title}
        </h1>
        <p className="max-w-[520px] text-sm text-muted-foreground">{analyticsHeader.subtitle}</p>
      </header>

      {isLoading ? (
        <Loading className="min-h-[220px]" message="Loading room usage analytics..." />
      ) : error ? (
        <ErrorBlock className="min-h-[220px]" message={error} onRetry={refresh} />
      ) : data?.hasData ? (
        <>
          <AnalyticsKpiGrid items={data.kpis} />
          <AnalyticsUsageDistribution chart={data.chart} />

          {/*
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
            <AnalyticsPerformanceTable performance={analyticsPerformance} />
            <AnalyticsSystemInsights insights={analyticsInsights} />
          </div>
          */}
        </>
      ) : (
        <Empty
          className="min-h-[240px]"
          description="Room usage analytics will appear once bookings are recorded."
          title="No analytics data is available yet"
        />
      )}
    </div>
  );
}

export default AdminAnalyticsPage;
