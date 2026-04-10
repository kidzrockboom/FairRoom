import { cn } from "@/lib/utils";

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export default function RoomCardSkeleton() {
  return (
    <article className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <Bone className="h-4 w-2/3" />
        <Bone className="h-5 w-16 rounded-full" />
      </div>

      <Bone className="h-4 w-1/2" />

      <div className="flex items-center gap-3">
        <Bone className="h-4 w-20" />
        <Bone className="h-4 w-4" />
        <Bone className="h-4 w-4" />
      </div>

      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-3/4" />

      <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
        <Bone className="h-9 rounded-md" />
        <Bone className="h-9 rounded-md" />
      </div>
    </article>
  );
}
