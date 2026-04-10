import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PanelFrameVariant = "sidebar" | "surface";

type PanelFrameProps = {
  as?: "aside" | "div" | "section";
  children: ReactNode;
  className?: string;
  variant?: PanelFrameVariant;
};

const VARIANT_CLASSES: Record<PanelFrameVariant, string> = {
  sidebar: "flex w-full flex-col bg-sidebar lg:min-h-full lg:w-[272px] lg:shrink-0 lg:self-stretch",
  surface: "rounded-card border border-border bg-surface",
};

export default function PanelFrame({
  as: Tag = "div",
  children,
  className,
  variant = "surface",
}: PanelFrameProps) {
  return <Tag className={cn(VARIANT_CLASSES[variant], className)}>{children}</Tag>;
}
