declare module "lucide-react" {
  import * as React from "react";

  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;

  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUpDown: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Menu: LucideIcon;
  export const LayoutDashboard: LucideIcon;

  export const Plus: LucideIcon;
  export const Search: LucideIcon;
  export const Download: LucideIcon;
  export const Settings: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const X: LucideIcon;
  export const Filter: LucideIcon;
  export const SlidersHorizontal: LucideIcon;
  export const Check: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const Power: LucideIcon;
  export const Trash2: LucideIcon;

  export const Calendar: LucideIcon;
  export const Clock: LucideIcon;
  export const MapPin: LucideIcon;
  export const Building2: LucideIcon;
  export const DoorOpen: LucideIcon;
  export const Wifi: LucideIcon;
  export const Monitor: LucideIcon;
  export const Wind: LucideIcon;
  export const Pen: LucideIcon;

  export const User: LucideIcon;
  export const Users: LucideIcon;
  export const LogOut: LucideIcon;

  export const Bell: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const XCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Info: LucideIcon;
  export const ShieldAlert: LucideIcon;

  export const BarChart2: LucideIcon;
  export const TrendingUp: LucideIcon;

  export const ChevronLeftIcon: LucideIcon;
  export const ChevronRightIcon: LucideIcon;
  export const ChevronDownIcon: LucideIcon;
  export const ChevronUpIcon: LucideIcon;
  export const CheckIcon: LucideIcon;
  export const XIcon: LucideIcon;
}
