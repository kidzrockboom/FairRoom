import { Button } from "@/components/ui/button";
import { ChevronRight, ShieldAlert, iconProps } from "@/lib/icons";

export default function AccountHealthReminder() {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-card border border-border bg-sidebar/65 px-4 py-3.5">
      <ShieldAlert
        {...iconProps}
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-content">Account Health Reminder</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          You currently have 1 strike. 3 strikes result in a 3-week booking suspension. Know your limits!
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 gap-1 px-1 text-sm text-content hover:bg-transparent hover:text-content"
      >
        View Account
        <ChevronRight size={24} strokeWidth={2} aria-hidden="true" className="size-5! shrink-0" />
      </Button>
    </div>
  );
}
