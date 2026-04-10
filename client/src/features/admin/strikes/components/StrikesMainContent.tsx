import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, iconProps, Users } from "@/lib/icons";

import type { StrikeStudent } from "@/features/admin/strikes/content";
import { strikeSummary } from "@/features/admin/strikes/content";

type StrikesMainContentProps = {
  student: StrikeStudent;
};

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function accountStateLabel(accountState: StrikeStudent["accountState"]) {
  switch (accountState) {
    case "good":
      return "Good standing";
    case "warned":
      return "Account warned";
    case "restricted":
      return "Restricted";
  }
}

export default function StrikesMainContent({ student }: StrikesMainContentProps) {
  return (
    <div className="flex h-full flex-col gap-4 self-stretch">
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-card bg-surface p-4 ring-1 ring-border/40">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarImage src={student.avatarUrl} alt={student.fullName} />
            <AvatarFallback className="text-sm font-semibold">
              {getInitials(student.fullName)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h1 className="font-heading text-[28px] font-bold tracking-tight text-content">
              {student.fullName}
            </h1>
            <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Users {...iconProps} aria-hidden="true" />
                {student.studentCode}
              </span>
              <span aria-hidden="true">•</span>
              <span>{student.program}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <Badge className="rounded-full px-3 py-1 text-xs font-semibold shadow-none">
            {accountStateLabel(student.accountState)}
          </Badge>
          <p className="text-xs text-muted-foreground">Last update: {student.lastUpdate}</p>
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
                  <p className="mt-1 text-4xl font-bold text-content">{strikeSummary.currentStrikes}</p>
                </div>

                <ChevronLeft {...iconProps} aria-hidden="true" className="rotate-180 text-muted-foreground" />

                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Proposed
                  </p>
                  <p className="mt-1 text-4xl font-bold text-content">{strikeSummary.proposedStrikes}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-10 gap-2 text-sm font-semibold shadow-none">
                − Decrease
              </Button>
              <Button variant="outline" className="h-10 gap-2 text-sm font-semibold shadow-none">
                + Increase
              </Button>
              <Button variant="ghost" className="h-10 text-sm font-semibold text-muted-foreground">
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
              readOnly
              placeholder="Please provide a detailed justification for this strike adjustment..."
              className="min-h-[132px] w-full rounded-card bg-muted/10 px-3 py-3 text-sm text-content placeholder:text-muted-foreground ring-1 ring-border/40 focus:outline-none"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              This note will be logged in the system and visible to other administrators.
            </p>
          </CardContent>
        </Card>
      </div>

      <footer className="flex flex-wrap items-center justify-end gap-2 pt-1">
        <Button variant="ghost" className="h-10 px-4 text-sm font-semibold text-muted-foreground">
          Discard
        </Button>
        <Button className="h-10 px-4 text-sm font-semibold">Save User Record</Button>
      </footer>
    </div>
  );
}
