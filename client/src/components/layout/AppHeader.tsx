import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, DoorOpen, LogOut, ChevronDown, iconPropsAction, iconProps } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/features/session/useSession";

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
  const navigate = useNavigate();
  const { currentUser, signOut } = useSession();
  const roleLabel = currentUser?.role === "admin" ? "Admin" : "Student";
  const fullName = currentUser?.fullName ?? "FairRoom User";
  const email = currentUser?.email ?? "";
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

          <Popover>
            <PopoverTrigger
              className="flex items-center gap-3 rounded-full px-2.5 py-2 outline-none transition-colors hover:bg-muted/70 focus-visible:bg-muted/70"
              aria-label="Open account menu"
            >
              <div className="hidden text-right sm:block">
                <p className="max-w-40 truncate text-sm font-medium text-content">{fullName}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>

              <Avatar className="size-10">
                <AvatarFallback className="bg-brand-100 text-sm font-semibold text-brand-600">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <ChevronDown {...iconProps} aria-hidden="true" className="hidden text-muted-foreground sm:block" />
            </PopoverTrigger>

            <PopoverContent align="end" className="w-72 p-3">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11">
                    <AvatarFallback className="bg-brand-100 text-sm font-semibold text-brand-600">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-content">{fullName}</div>
                    <div className="truncate text-xs text-muted-foreground">{email}</div>
                    <Badge
                      className="mt-1 border-border bg-muted-foreground/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                      variant="outline"
                    >
                      {roleLabel}
                    </Badge>
                  </div>
                </div>

                <Button
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    signOut();
                    navigate("/login", { replace: true });
                  }}
                  variant="outline"
                >
                  <LogOut {...iconProps} aria-hidden="true" />
                  Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
