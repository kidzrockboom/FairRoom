import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PanelFrame from "@/components/ui/panel-frame";
import { Search, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { StrikeDirectoryRowViewModel } from "../strikesMappers";

type StrikesDirectoryPanelProps = {
  students: StrikeDirectoryRowViewModel[];
  selectedStudentId: string | null;
  search: string;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onSelectStudent: (userId: string) => void;
};

function strikeLabel(strikes: number) {
  return `${strikes} ${strikes === 1 ? "Strike" : "Strikes"}`;
}

export default function StrikesDirectoryPanel({
  students,
  selectedStudentId,
  search,
  isLoading,
  onSearchChange,
  onSelectStudent,
}: StrikesDirectoryPanelProps) {
  return (
    <PanelFrame as="aside" variant="sidebar" className="h-full overflow-hidden lg:w-[304px] xl:w-[320px]">
      <div className="border-b border-border px-4 py-4">
        <h2 className="font-heading text-[22px] font-bold tracking-tight text-content">Student Directory</h2>
        <div className="relative mt-3">
          <Search
            {...iconProps}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            aria-label="Search students"
            placeholder="Search by name or email..."
            className="h-10 pl-9"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {isLoading && students.length === 0 ? (
          <p className="px-1 py-2 text-sm text-muted-foreground">Loading students...</p>
        ) : null}

        {!isLoading && students.length === 0 ? (
          <p className="px-1 py-2 text-sm text-muted-foreground">No students found.</p>
        ) : null}

        {students.map((student) => {
          const isSelected = student.id === selectedStudentId;

          return (
            <button
              key={student.id}
              type="button"
              onClick={() => onSelectStudent(student.id)}
              className={cn(
                "flex items-center gap-3 rounded-card border bg-surface px-3 py-2.5 text-left transition-colors",
                isSelected ? "border-brand-300 ring-1 ring-brand-300/40" : "border-border hover:border-border/80",
              )}
            >
              <Avatar className="size-10">
                <AvatarFallback className="text-xs font-semibold">{student.initials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-content">{student.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">{student.email}</p>
              </div>

              <Badge
                variant="outline"
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-semibold shadow-none",
                  student.activeStrikes >= 3
                    ? "border-destructive/20 bg-destructive/10 text-destructive"
                    : student.activeStrikes > 0
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-border bg-muted/40 text-muted-foreground",
                )}
              >
                {strikeLabel(student.activeStrikes)}
              </Badge>
            </button>
          );
        })}
      </div>
    </PanelFrame>
  );
}
