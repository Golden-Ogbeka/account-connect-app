import clsx from 'clsx';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx('animate-pulse rounded-md bg-slate-200/80', className)} />
);

export const TableSkeleton = ({ rows = 8 }: { rows?: number }) => (
  <div role="status" aria-live="polite">
    <div className="space-y-3 sm:hidden">
      {Array.from({ length: Math.min(rows, 4) }).map((_, i) => (
        <div
          key={i}
          className="space-y-4 rounded-[28px] border border-slate-200/80 bg-white/92 px-5 py-5 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
    <div className="hidden divide-y divide-slate-200 rounded-[28px] border border-slate-200/80 bg-white/94 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] sm:block">
      <div className="grid grid-cols-12 gap-3 px-6 py-4">
        <Skeleton className="col-span-3 h-4" />
        <Skeleton className="col-span-4 h-4" />
        <Skeleton className="col-span-2 h-4" />
        <Skeleton className="col-span-2 h-4" />
        <Skeleton className="col-span-1 h-4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-12 gap-3 px-6 py-5">
          <Skeleton className="col-span-3 h-4" />
          <Skeleton className="col-span-4 h-5" />
          <Skeleton className="col-span-2 h-4" />
          <Skeleton className="col-span-2 h-4" />
          <Skeleton className="col-span-1 h-8 rounded-full" />
        </div>
      ))}
    </div>
    <span className="sr-only">Loading…</span>
  </div>
);
