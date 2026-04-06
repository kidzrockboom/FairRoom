import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  MoreHorizontal,
  iconProps,
} from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminBookingRow, AdminBookingStatus } from "@/data/adminMockData";

type AdminBookingsTableProps = {
  rows: AdminBookingRow[];
};

const STATUS_LABELS: Record<AdminBookingStatus, string> = {
  active: "Active",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No-Show",
};

const STATUS_CLASSES: Record<AdminBookingStatus, string> = {
  active: "border-border bg-surface text-content",
  cancelled: "border-border bg-muted/70 text-muted-foreground",
  completed: "border-border bg-muted/50 text-muted-foreground",
  no_show: "border-transparent bg-destructive/10 text-destructive",
};

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AdminBookingsTable({ rows }: AdminBookingsTableProps) {
  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/35 hover:bg-muted/35">
              <TableHead className="w-[34%] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  User Details
                  <ArrowUpDown {...iconProps} aria-hidden="true" className="text-muted-foreground" />
                </span>
              </TableHead>
              <TableHead className="w-[23%] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Room
              </TableHead>
              <TableHead className="w-[23%] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Date &amp; Time
              </TableHead>
              <TableHead className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="w-[8%] px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/25">
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" className="size-9">
                      <AvatarImage src={row.avatarUrl} alt={row.userFullName} />
                      <AvatarFallback className="text-xs font-semibold">
                        {getInitials(row.userFullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-content">{row.userFullName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{row.userCode}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-content">{row.roomName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">ID: {row.roomCode}</p>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-content">{row.dateLabel}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock {...iconProps} aria-hidden="true" className="text-muted-foreground" />
                      {row.timeLabel}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none",
                      STATUS_CLASSES[row.status],
                    )}
                  >
                    {STATUS_LABELS[row.status]}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-content"
                        >
                          <MoreHorizontal data-icon="inline-start" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View booking</DropdownMenuItem>
                      <DropdownMenuItem>View user</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">Cancel booking</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing <span className="font-semibold text-content">{rows.length}</span> bookings in the current view
        </p>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs shadow-none">
            <ChevronLeft data-icon="inline-start" />
            Prev
          </Button>
          <span className="text-xs font-medium text-content">Page 1 of 3</span>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs shadow-none">
            Next
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </section>
  );
}
