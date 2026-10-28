export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  colorIndex?: number;
  loading?: boolean;
}

const ACCENT_BARS = [
  'before:bg-[#22B2B8]', // Cyan
  'before:bg-[#F43F5E]', // Fuchsia
  'before:bg-[#8B5CF6]', // Purple
  'before:bg-[#F59E0B]', // Gold
  'before:bg-[#10B981]', // Emerald
];

export function MetricCard({
  title,
  value,
  change,
  trend,
  colorIndex = 0,
  loading = false,
}: MetricCardProps) {
  const accentClass = ACCENT_BARS[colorIndex % ACCENT_BARS.length];

  return (
    <div
      className={`bg-[var(--color-surface-card)] p-5 sm:p-6 rounded-2xl shadow-[var(--shadow-organic)] border border-[var(--color-border)] transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 ${accentClass}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-[var(--color-text-secondary)] text-xs sm:text-sm font-medium">
          {title}
        </h3>
      </div>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="w-24 h-7 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-36 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {value}
          </p>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full self-start sm:self-auto ${
              trend === 'up'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : trend === 'down'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
