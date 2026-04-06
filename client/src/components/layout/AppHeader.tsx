import type { ReactNode } from "react";
import { Bell, DoorOpen, iconPropsAction } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/data/sessionMock";

type AppHeaderProps = {
  mobileSidebarTrigger?: ReactNode;
};

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function AppHeader({ mobileSidebarTrigger }: AppHeaderProps) {
  const roleLabel = currentUser?.role === "admin" ? "Admin" : "Student";
  const fullName = currentUser?.fullName ?? "FairRoom User";
  const initials = getInitials(fullName);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-18 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="lg:hidden">{mobileSidebarTrigger}</div>

          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg border-3 border-brand-500 bg-brand-50 text-brand-500">
              <DoorOpen {...iconPropsAction} aria-hidden="true" />
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <span className="font-heading text-xl font-semibold tracking-tight text-brand-500">
                FairRoom
              </span>
              <Separator className="hidden h-7 bg-border-strong sm:block" orientation="vertical" />
              <Badge
                className="hidden border-border bg-muted-foreground/10 px-2 py-1 font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex"
                variant="outline"
              >
                {roleLabel}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            aria-label="Notifications"
            className="hidden sm:inline-flex"
            size="icon-sm"
            variant="ghost"
          >
            <Bell {...iconPropsAction} aria-hidden="true" />
          </Button>

          <div className="flex items-center gap-3 rounded-full px-2.5 py-2">
            <div className="hidden text-right sm:block">
              <p className="max-w-40 truncate text-sm font-medium text-content">{fullName}</p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>

            <div className="flex size-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-600">
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
