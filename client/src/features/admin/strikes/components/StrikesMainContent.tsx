import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, iconProps, Users } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  getStrikeAccountStateLabel,
  getStrikeAccountStateTone,
  type StrikeStudentViewModel,
} from "../strikesMappers";
import { strikeAdjustmentNote } from "../content";

type StrikesMainContentProps = {
  student: StrikeStudentViewModel | null;
  activeStrikes: number;
  proposedStrikes: number;
  reason: string;
  isSaving: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onReset: () => void;
  onReasonChange: (value: string) => void;
  onSave: () => void;
};

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function StrikesMainContent({
  student,
  activeStrikes,
  proposedStrikes,
  reason,
  isSaving,
  onIncrease,
  onDecrease,
  onReset,
  onReasonChange,
  onSave,
}: StrikesMainContentProps) {
  if (!student) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-card border border-border bg-surface text-sm text-muted-foreground">
        Select a student to review strikes.
      </div>
    );
  }

  return (
    <div data-testid="strike-main-content" className="flex h-full flex-col gap-4 self-stretch">
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-card bg-surface p-4 ring-1 ring-border/40">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-sm font-semibold">{getInitials(student.fullName)}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h1 className="font-heading text-[28px] font-bold tracking-tight text-content">{student.fullName}</h1>
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Users {...iconProps} aria-hidden="true" />
                {student.email}
              </span>
              <span aria-hidden="true">•</span>
              <span>Admin review</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold shadow-none", getStrikeAccountStateTone(student.accountState))}>
            {getStrikeAccountStateLabel(student.accountState)}
          </Badge>
          <p className="text-xs text-muted-foreground">Last update: {student.lastUpdateLabel}</p>
        </div>
      </header>

      <div className="grid gap-4">
        <Card className="border-0 bg-surface shadow-none ring-1 ring-border/40">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm font-semibold text-content">Strike Adjustment</CardTitle>
            <p className="text-xs text-muted-foreground">Modify the student strike count manually.</p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="rounded-card bg-muted/20 p-4 ring-1 ring-border/40">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Current
                  </p>
                  <p className="mt-1 text-4xl font-bold text-content">{activeStrikes}</p>
                </div>

                <ChevronLeft {...iconProps} aria-hidden="true" className="rotate-180 text-muted-foreground" />

                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Proposed
                  </p>
                  <p className="mt-1 text-4xl font-bold text-content">{proposedStrikes}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-10 gap-2 text-sm font-semibold shadow-none" onClick={onDecrease}>
                − Decrease
              </Button>
              <Button variant="outline" className="h-10 gap-2 text-sm font-semibold shadow-none" onClick={onIncrease}>
                + Increase
              </Button>
              <Button variant="ghost" className="h-10 text-sm font-semibold text-muted-foreground" onClick={onReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-surface shadow-none ring-1 ring-border/40">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm font-semibold text-content">Reason for Adjustment</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <textarea
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Please provide a detailed justification for this strike adjustment..."
              className="min-h-[132px] w-full rounded-card bg-muted/10 px-3 py-3 text-sm text-content placeholder:text-muted-foreground ring-1 ring-border/40 focus:outline-none"
            />
            <p className="mt-3 text-xs text-muted-foreground">{strikeAdjustmentNote}</p>
          </CardContent>
        </Card>
      </div>

      <footer className="flex flex-wrap items-center justify-end gap-2 pt-1">
        <Button variant="ghost" className="h-10 px-4 text-sm font-semibold text-muted-foreground" onClick={onReset}>
          Discard
        </Button>
        <Button className="h-10 px-4 text-sm font-semibold" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save User Record"}
        </Button>
      </footer>
    </div>
  );
}
