import { cn } from "@/lib/utils";

export type SlotStatus = "available" | "reserved" | "selected";

export type TimeSlot = {
  time: string;
  status: SlotStatus;
};

type SlotButtonProps = {
  slot: TimeSlot;
};

export default function SlotButton({ slot }: SlotButtonProps) {
  const isReserved = slot.status === "reserved";
  const isSelected = slot.status === "selected";

  return (
    <button
      type="button"
      disabled={isReserved}
      className={cn(
        "relative flex flex-col items-center gap-0.5 rounded-lg border py-3 px-2 text-center transition-colors",
        isSelected
          ? "border-2 border-primary bg-primary/5"
          : isReserved
            ? "cursor-not-allowed border-border bg-surface opacity-50"
            : "border-border bg-surface hover:border-primary/40",
      )}
    >
      {isSelected && (
        <span className="absolute right-2 top-2 size-3 rounded-full border-2 border-primary bg-surface" />
      )}
      <span className={cn("text-sm font-semibold", isSelected ? "text-primary" : "text-content")}>
        {slot.time}
      </span>
      <span
        className={cn(
          "text-[10px] font-bold uppercase tracking-wide",
          isReserved
            ? "text-muted-foreground"
            : isSelected
              ? "text-primary"
              : "text-muted-foreground",
        )}
      >
        {isReserved ? "Reserved" : "Available"}
      </span>
    </button>
  );
}
