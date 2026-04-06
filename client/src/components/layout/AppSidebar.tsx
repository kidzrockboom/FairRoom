import { NavLink } from "react-router-dom";
import {
  BarChart2,
  Building2,
  Calendar,
  LayoutDashboard,
  LogOut,
  Search,
  ShieldAlert,
  iconProps,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/sessionMock";

type AppSidebarProps = {
  onNavigate?: () => void;
};

type NavItem = {
  label: string;
  Icon: typeof Search;
  to?: string;
  disabled?: boolean;
};

const studentItems: NavItem[] = [
  { to: "/search", label: "Search Rooms", Icon: Search },
  { to: "/bookings", label: "My Bookings", Icon: Calendar },
  { to: "/account", label: "Account Status", Icon: ShieldAlert },
];

const adminItems: NavItem[] = [
  { to: "/admin/overview", label: "Overview", Icon: LayoutDashboard },
  { to: "/admin/strikes", label: "Strikes", Icon: ShieldAlert },
  { label: "Inventory", Icon: Building2, disabled: true },
  { to: "/admin/analytics", label: "Analytics", Icon: BarChart2 },
];

function AppSidebar({ onNavigate }: AppSidebarProps) {
  const items = currentUser?.role === "admin" ? adminItems : studentItems;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-4 py-5 lg:hidden">
        <span className="font-heading text-lg font-semibold text-brand-500">FairRoom</span>
      </div>

      <Separator className="lg:hidden" />

      <nav className="flex flex-1 flex-col gap-2 px-3 py-4">
        {items.map(({ to, label, Icon, disabled }) =>
          disabled ? (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-subtle"
            >
              <Icon {...iconProps} aria-hidden="true" />
              <span>{label}</span>
              <span className="ml-auto rounded-full bg-surface-raised px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                Soon
              </span>
            </div>
          ) : (
            <NavLink
              key={to}
              to={to!}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-brand-50 hover:text-content",
                  isActive && "bg-brand-500 text-white hover:bg-brand-500 hover:text-white",
                )
              }
            >
              <Icon {...iconProps} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ),
        )}
      </nav>

      <div className="px-3 pb-4">
        <Separator className="mb-4" />
        <Button className="w-full justify-start" variant="outline-destructive">
          <LogOut {...iconProps} aria-hidden="true" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export default AppSidebar;
