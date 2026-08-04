/**
 * Loading states.
 * <Loader />            — centered spinner for full-page loads
 * <Loader.Skeleton />   — shimmering block for card skeletons
 */
export default function Loader({ label = "Loading…" }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-line border-t-accent" />
        <p className="text-xs text-ink-faint">{label}</p>
      </div>
    </div>
  );
}

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/[0.05] ${className}`} />
  );
}
Loader.Skeleton = Skeleton;

/** Ready-made skeleton layout for dashboard-style pages */
export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}
