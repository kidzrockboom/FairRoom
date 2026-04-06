import { Button } from "@/components/ui/button";
import { CheckCircle, X, iconProps } from "@/lib/icons";

import { inventorySyncMessage } from "@/features/admin-inventory/adminInventoryContent";

export default function InventoryBanner() {
  return (
    <div className="flex items-start justify-between gap-4 rounded-card border border-border bg-surface px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-success-subtle text-success">
          <CheckCircle {...iconProps} aria-hidden="true" />
        </div>

        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-content">{inventorySyncMessage.title}</p>
          <p className="text-sm text-muted-foreground">{inventorySyncMessage.description}</p>
        </div>
      </div>

      <Button
        aria-label="Dismiss inventory message"
        className="shrink-0 text-muted-foreground"
        size="icon-sm"
        variant="ghost"
      >
        <X aria-hidden="true" />
      </Button>
    </div>
  );
}
