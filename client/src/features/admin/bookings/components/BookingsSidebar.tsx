import { ArrowUpRight, Clock, iconProps } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AdminQuickLink } from "@/features/admin/bookings/content";

type BookingsSidebarProps = {
  quickLinks: AdminQuickLink[];
  proTip: string;
};

export default function BookingsSidebar({
  quickLinks,
  proTip,
}: BookingsSidebarProps) {
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
                className="h-auto w-full justify-start rounded-md px-2 py-2 text-left text-sm font-medium text-content hover:bg-muted/50"
              >
                <span>{item.label}</span>
              </Button>
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
