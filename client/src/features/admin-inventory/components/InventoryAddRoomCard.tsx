import { Card, CardContent } from "@/components/ui/card";
import { Plus, iconPropsLg } from "@/lib/icons";

type InventoryAddRoomCardProps = {
  onClick: () => void;
};

export default function InventoryAddRoomCard({ onClick }: InventoryAddRoomCardProps) {
  return (
    <Card
      className="min-h-[260px] cursor-pointer border-dashed border-border bg-surface shadow-none ring-1 ring-border/40 transition-colors hover:bg-muted/20"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <CardContent className="flex min-h-[260px] flex-col items-center justify-center px-6 py-8 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-muted/50 text-content">
          <Plus {...iconPropsLg} aria-hidden="true" />
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-heading text-[18px] font-bold tracking-tight text-content">
            Add New Room
          </h3>
          <p className="max-w-[180px] text-sm leading-relaxed text-muted-foreground">
            Expand your inventory with a new bookable space.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
