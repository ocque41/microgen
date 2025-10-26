export function DashboardSkeleton() {
  return (
    <div
      className="min-h-screen animate-pulse bg-surface-background px-6 py-16 text-text"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-full bg-[color:rgba(244,241,234,0.08)]" />
            <div className="h-4 w-72 rounded-full bg-[color:rgba(244,241,234,0.06)]" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-9 w-32 rounded-full bg-[color:rgba(244,241,234,0.08)]" />
            <div className="h-9 w-40 rounded-full bg-[color:rgba(244,241,234,0.08)]" />
          </div>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="space-y-3 rounded-3xl bg-[color:rgba(244,241,234,0.04)] p-8">
              <div className="h-5 w-40 rounded-full bg-[color:rgba(244,241,234,0.08)]" />
              <div className="h-4 w-full rounded-full bg-[color:rgba(244,241,234,0.06)]" />
              <div className="h-4 w-5/6 rounded-full bg-[color:rgba(244,241,234,0.06)]" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 rounded-2xl bg-[color:rgba(244,241,234,0.05)]"
                />
              ))}
            </div>

            <div className="space-y-4 rounded-3xl bg-[color:rgba(244,241,234,0.05)] p-6">
              <div className="h-4 w-36 rounded-full bg-[color:rgba(244,241,234,0.08)]" />
              <div className="h-10 w-full rounded-full bg-[color:rgba(244,241,234,0.06)]" />
              <div className="h-10 w-32 rounded-full bg-[color:rgba(244,241,234,0.08)]" />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl bg-[color:rgba(244,241,234,0.05)] p-6">
            <div className="h-5 w-40 rounded-full bg-[color:rgba(244,241,234,0.08)]" />
            <div className="h-4 w-full rounded-full bg-[color:rgba(244,241,234,0.06)]" />
            <div className="h-10 w-full rounded-full bg-[color:rgba(244,241,234,0.08)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
