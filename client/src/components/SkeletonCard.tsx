// Skeleton placeholder cards displayed during initial load.

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard({ count = 4 }: SkeletonCardProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 px-4 max-w-3xl mx-auto animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/40 min-h-[140px] flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-md w-3/4" />
            <div className="h-3 bg-stone-200/70 dark:bg-stone-800/60 rounded-md w-full" />
            <div className="h-3 bg-stone-200/70 dark:bg-stone-800/60 rounded-md w-5/6" />
          </div>
          <div className="h-2.5 bg-stone-200/50 dark:bg-stone-800/40 rounded w-1/3 mt-4" />
        </div>
      ))}
    </div>
  );
}
