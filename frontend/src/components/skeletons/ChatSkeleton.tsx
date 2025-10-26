export function ChatSkeleton() {
  return (
    <div
      className="flex min-h-screen items-stretch justify-center bg-surface-background px-4 py-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-[85vh] w-full max-w-4xl flex-1 animate-pulse rounded-3xl bg-[color:rgba(244,241,234,0.05)]" />
    </div>
  );
}
