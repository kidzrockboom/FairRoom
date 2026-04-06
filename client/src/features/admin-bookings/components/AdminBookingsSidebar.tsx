import { ArrowUpRight, Clock, iconProps } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { AdminQuickLink, AdminRecentActivity } from "@/data/adminMockData";

type AdminBookingsSidebarProps = {
  quickLinks: AdminQuickLink[];
  recentActivities: AdminRecentActivity[];
  proTip: string;
};

export default function AdminBookingsSidebar({
  quickLinks,
  recentActivities,
  proTip,
}: AdminBookingsSidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      <Card className="gap-0">
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-content">
            <ArrowUpRight {...iconProps} aria-hidden="true" className="text-muted-foreground" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="flex flex-col gap-1">
            {quickLinks.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "h-auto w-full justify-between rounded-md px-2 py-2 text-left text-sm font-medium text-content hover:bg-muted/50",
                )}
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[10px] font-semibold">
                    {item.badge}
                  </Badge>
                ) : null}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0">
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-content">
            <Clock {...iconProps} aria-hidden="true" className="text-muted-foreground" />
            Recent Activity
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Real-time system updates
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="flex flex-col">
            {recentActivities.map((item, index) => (
              <div key={item.id}>
                <div className="py-2">
                  <p className="text-sm font-semibold text-content">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.actor} • {item.when}
                  </p>
                </div>
                {index < recentActivities.length - 1 ? <Separator /> : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 border-brand-200/50 bg-brand-50/30">
        <CardHeader className="px-4 py-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-content">
            <span className="flex size-8 items-center justify-center rounded-md bg-brand-500/15 text-brand-500">
              <Clock {...iconProps} aria-hidden="true" />
            </span>
            Pro Tip
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <p className="text-sm leading-6 text-muted-foreground">{proTip}</p>
        </CardContent>
      </Card>
    </aside>
  );
}
