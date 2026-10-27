export function TransactionFormLoadingState() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-6 animate-pulse">
      <div className="h-10 bg-[var(--color-surface-card)] rounded-xl w-1/3"></div>
      <div className="h-44 bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)]"></div>
      <div className="h-72 bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)]"></div>
    </div>
  );
}
