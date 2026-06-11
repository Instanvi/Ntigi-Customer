"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TableSkeleton({
  rows = 5,
  columns = 4,
  /** Match DataTable’s leading selection column when using row checkboxes */
  includeSelectColumn = true,
  /** Lighter border-only shell (e.g. consolidation panels). */
  flat = false,
}: {
  rows?: number;
  columns?: number;
  includeSelectColumn?: boolean;
  flat?: boolean;
}) {
  const colCount = columns + (includeSelectColumn ? 1 : 0);
  return (
    <div
      className="w-full space-y-4"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading table…</span>
      <div
        className={cn(
          "overflow-x-auto rounded-[2px] border bg-white",
          flat
            ? "border-border shadow-none"
            : "border-input shadow-app-surface",
        )}
      >
        <Table>
          <TableHeader className="bg-[#F7F7F7] [&_tr]:border-b-0">
            <TableRow className="border-b-0 hover:bg-transparent">
              {Array.from({ length: colCount }).map((_, i) => (
                <TableHead
                  key={i}
                  className={cn(
                    "h-12 border-b-0 text-sm font-medium",
                    includeSelectColumn && i === 0 ? "w-12 px-2" : "px-3",
                  )}
                >
                  <Skeleton
                    className={cn(
                      "rounded-sm",
                      includeSelectColumn && i === 0
                        ? "mx-auto h-4 w-4"
                        : "h-4 w-24 max-w-[90%]",
                    )}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, ri) => (
              <TableRow
                key={ri}
                className="h-16 border-b border-input last:border-0 hover:bg-transparent"
              >
                {Array.from({ length: colCount }).map((_, ci) => (
                  <TableCell
                    key={ci}
                    className={cn(
                      "align-middle text-sm font-medium text-[#1E293B]",
                      includeSelectColumn && ci === 0 ? "w-12 px-2" : "px-3",
                    )}
                  >
                    <Skeleton
                      className={cn(
                        "rounded-sm",
                        includeSelectColumn && ci === 0
                          ? "mx-auto h-4 w-4"
                          : "h-4 w-full max-w-[160px]",
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
