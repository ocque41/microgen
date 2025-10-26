import { Fragment } from "react";

import { SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkbenchListSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-4" role="status" aria-live="polite">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-full bg-surface-elevated/50" />
        <Skeleton className="h-3 w-48 rounded-full bg-surface-elevated/40" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <SidebarMenuSkeleton key={`list-skeleton-${index}`} showIcon />
        ))}
      </div>
    </div>
  );
}

export function WorkbenchDetailSkeleton() {
  return (
    <div className="flex h-full flex-col gap-6 p-6" role="status" aria-live="polite">
      <div className="space-y-3">
        <Skeleton className="h-6 w-1/3 rounded-full bg-surface-elevated/60" />
        <Skeleton className="h-4 w-1/2 rounded-full bg-surface-elevated/40" />
      </div>
      <div className="grid gap-4 md:grid-cols-3" aria-hidden>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={`metric-${index}`} className="h-24 rounded-2xl bg-surface-elevated/40" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2" aria-hidden>
        {Array.from({ length: 4 }).map((_, index) => (
          <Fragment key={`detail-block-${index}`}>
            <Skeleton className="h-32 rounded-2xl bg-surface-elevated/30" />
          </Fragment>
        ))}
      </div>
      <Skeleton className="h-40 rounded-2xl bg-surface-elevated/30" aria-hidden />
    </div>
  );
}

