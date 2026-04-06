import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, iconProps } from "@/lib/icons";

import type { AnalyticsInsight } from "@/features/admin-analytics/adminAnalyticsContent";

type AnalyticsSystemInsightsProps = {
  insights: {
    title: string;
    recommendation: {
      title: string;
      description: string;
      meta?: string;
    };
    anomalies: AnalyticsInsight[];
  };
};

export default function AnalyticsSystemInsights({
  insights,
}: AnalyticsSystemInsightsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border-0 bg-surface shadow-none ring-1 ring-border/40">
        <CardHeader className="px-4 py-4">
          <CardTitle className="font-heading text-[18px] font-bold tracking-tight text-content">
            {insights.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 pt-0">
          <div className="rounded-card border border-primary/20 bg-primary/5 px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TrendingUp {...iconProps} aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-[16px] font-bold tracking-tight text-content">
                  {insights.recommendation.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {insights.recommendation.description}
                </p>
                {insights.recommendation.meta ? (
                  <Button
                    className="h-auto p-0 text-sm font-semibold text-primary shadow-none hover:text-primary/80"
                    variant="link"
                  >
                    {insights.recommendation.meta}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-content">Usage Anomalies</p>
            <div className="flex flex-col gap-3">
              {insights.anomalies.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-card bg-muted/20 px-3 py-3">
                  <div className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-surface text-muted-foreground ring-1 ring-border/40">
                    <Clock {...iconProps} aria-hidden="true" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-content">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    {item.meta ? (
                      <Badge
                        variant="outline"
                        className="rounded-full border-border bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted-foreground shadow-none"
                      >
                        {item.meta}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
