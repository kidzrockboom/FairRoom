import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Info, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

import type { AnalyticsPerformanceRow } from "@/features/admin-analytics/adminAnalyticsContent";

type AnalyticsPerformanceTableProps = {
  performance: {
    title: string;
    inlineNote: string;
    rows: AnalyticsPerformanceRow[];
  };
};

const EFFICIENCY_CLASSES: Record<AnalyticsPerformanceRow["efficiency"], string> = {
  High: "bg-primary text-primary-foreground",
  Medium: "bg-muted text-muted-foreground",
  Low: "bg-muted text-muted-foreground",
};

export default function AnalyticsPerformanceTable({
  performance,
}: AnalyticsPerformanceTableProps) {
  return (
    <Card className="border-0 bg-surface shadow-none ring-1 ring-border/40">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="space-y-1">
          <CardTitle className="font-heading text-[18px] font-bold tracking-tight text-content">
            {performance.title}
          </CardTitle>
        </div>

        <Badge
          variant="outline"
          className="rounded-full border-destructive/20 bg-destructive/5 px-3 py-1 text-[11px] font-semibold text-destructive shadow-none"
        >
          <Info {...iconProps} aria-hidden="true" />
          {performance.inlineNote}
        </Badge>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="px-0 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Room Identifier
              </TableHead>
              <TableHead className="px-0 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Total Usage
              </TableHead>
              <TableHead className="px-0 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Occupancy %
              </TableHead>
              <TableHead className="px-0 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Efficiency
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performance.rows.map((row) => (
              <TableRow key={row.roomIdentifier} className="border-border/30 hover:bg-muted/20">
                <TableCell className="px-0 py-4 font-medium text-content">
                  {row.roomIdentifier}
                </TableCell>
                <TableCell className="px-0 py-4 text-muted-foreground">{row.totalUsage}</TableCell>
                <TableCell className="px-0 py-4 text-muted-foreground">{row.occupancyPct}%</TableCell>
                <TableCell className="px-0 py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold shadow-none",
                      EFFICIENCY_CLASSES[row.efficiency],
                    )}
                  >
                    {row.efficiency}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
