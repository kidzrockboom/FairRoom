import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { badgeVariants } from "@/components/ui/badge-variants"

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
