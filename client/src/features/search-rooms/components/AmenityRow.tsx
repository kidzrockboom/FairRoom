import type { LucideIcon } from "lucide-react";
import { iconProps } from "@/lib/icons";

type AmenityIcon = LucideIcon;

type AmenityRowProps = {
  Icon: AmenityIcon;
  label: string;
};

export default function AmenityRow({ Icon, label }: AmenityRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-border bg-sidebar/65 px-4 py-3 text-sm text-content">
      <Icon {...iconProps} aria-hidden="true" className="shrink-0 text-muted-foreground" />
      {label}
    </div>
  );
}
