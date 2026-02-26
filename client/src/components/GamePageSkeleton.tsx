/**
 * GamePageSkeleton — mirrors the PlayGame page layout with animated shimmer
 * placeholders. Shown while the game data is loading.
 */
export default function GamePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 animate-pulse">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-4 pb-2">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="h-8 w-72 bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />

            {/* Game frame */}
            <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />

            {/* Action bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-9 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>

            {/* About section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 mb-4">
              <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-4 w-4/6 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
            </div>

            {/* Trivia card */}
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900/40 p-5 mb-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/40 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-amber-100 dark:bg-amber-900/40 rounded" />
                  <div className="h-4 w-full bg-amber-100 dark:bg-amber-900/40 rounded" />
                  <div className="h-4 w-3/4 bg-amber-100 dark:bg-amber-900/40 rounded" />
                </div>
              </div>
            </div>

            {/* More like this */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden">
                    <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800" />
                    <div className="p-2 space-y-1.5">
                      <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg mb-3" />
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-12 h-9 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
