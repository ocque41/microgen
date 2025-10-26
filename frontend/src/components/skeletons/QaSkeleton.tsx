export function QaSkeleton() {
  return (
    <section
      aria-label="Loading quality metrics"
      aria-busy="true"
      className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 text-left lg:px-8"
    >
      <div className="flex flex-col gap-3">
        <span className="h-4 w-24 animate-pulse rounded-full bg-[color:rgba(255,255,255,0.08)]" />
        <span className="h-10 w-72 animate-pulse rounded-full bg-[color:rgba(255,255,255,0.12)]" />
        <span className="h-4 w-96 animate-pulse rounded-full bg-[color:rgba(255,255,255,0.06)]" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-4 rounded-2xl border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(16,18,26,0.72)] p-6"
          >
            <span className="h-3 w-20 animate-pulse rounded-full bg-[color:rgba(255,255,255,0.08)]" />
            <span className="h-8 w-24 animate-pulse rounded-full bg-[color:rgba(255,255,255,0.12)]" />
            <span className="h-3 w-32 animate-pulse rounded-full bg-[color:rgba(255,255,255,0.06)]" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-[color:rgba(255,255,255,0.08)] bg-[color:rgba(12,14,20,0.6)] p-6">
        <span className="h-4 w-40 animate-pulse rounded-full bg-[color:rgba(255,255,255,0.08)]" />
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="h-3 w-full animate-pulse rounded-full bg-[color:rgba(255,255,255,0.06)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
