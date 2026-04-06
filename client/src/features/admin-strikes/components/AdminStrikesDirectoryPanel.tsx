import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, iconProps } from "@/lib/icons";
import PanelFrame from "@/components/ui/panel-frame";
import { cn } from "@/lib/utils";

import type { StrikeStudent } from "@/features/admin-strikes/adminStrikesContent";

type AdminStrikesDirectoryPanelProps = {
  students: StrikeStudent[];
  selectedStudentId: string;
};

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function strikeLabel(strikes: number) {
  return `${strikes} ${strikes === 1 ? "Strike" : "Strikes"}`;
}

export default function AdminStrikesDirectoryPanel({
  students,
  selectedStudentId,
}: AdminStrikesDirectoryPanelProps) {
  return (
    <PanelFrame as="aside" variant="sidebar" className="h-full overflow-hidden lg:w-[304px] xl:w-[320px]">
      <div className="border-b border-border px-4 py-4">
        <h2 className="font-heading text-[22px] font-bold tracking-tight text-content">
          Student Directory
        </h2>
        <div className="relative mt-3">
          <Search
            {...iconProps}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            readOnly
            placeholder="Search by name or ID..."
            className="h-10 pl-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {students.map((student) => {
          const isSelected = student.id === selectedStudentId;

          return (
            <div
              key={student.id}
              className={cn(
                "flex items-center gap-3 rounded-card border bg-surface px-3 py-2.5 transition-colors",
                isSelected ? "border-brand-300 ring-1 ring-brand-300/40" : "border-border",
              )}
            >
              <Avatar className="size-10">
                <AvatarImage src={student.avatarUrl} alt={student.fullName} />
                <AvatarFallback className="text-xs font-semibold">
                  {getInitials(student.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-content">{student.fullName}</p>
                <p className="text-xs text-muted-foreground">ID: {student.studentCode}</p>
              </div>

              <Badge
                variant="outline"
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-semibold shadow-none",
                  student.strikes >= 3
                    ? "border-destructive/20 bg-destructive/10 text-destructive"
                    : student.strikes > 0
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-border bg-muted/40 text-muted-foreground",
                )}
              >
                {strikeLabel(student.strikes)}
              </Badge>
            </div>
          );
        })}
      </div>
    </PanelFrame>
  );
}
