import { Card, CardContent } from "@/components/ui/card";

type InventoryStatsProps = {
  totalSpaces: number;
  activeNow: number;
};

function InventoryStat({ label, value }: { label: string; value: number }) {
  return (
    <Card size="sm" className="min-w-[92px] border-0 bg-surface shadow-none ring-1 ring-border/40">
      <CardContent className="flex flex-col items-center justify-center gap-1 px-3 py-3 text-center">
        <span className="font-heading text-[24px] font-bold leading-none text-content">{value}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}

export default function InventoryStats({ totalSpaces, activeNow }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <InventoryStat label="Total Spaces" value={totalSpaces} />
      <InventoryStat label="Active Now" value={activeNow} />
    </div>
  );
}
