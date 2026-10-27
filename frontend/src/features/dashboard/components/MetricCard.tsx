export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  colorIndex?: number;
}

const ACCENT_BARS = [
  'before:bg-[#22B2B8]', // Cyan
  'before:bg-[#F43F5E]', // Fuchsia
  'before:bg-[#8B5CF6]', // Purple
  'before:bg-[#F59E0B]', // Gold
  'before:bg-[#F97316]', // Orange
];

export function MetricCard({ title, value, change, trend, colorIndex = 0 }: MetricCardProps) {
  const accentClass = ACCENT_BARS[colorIndex % ACCENT_BARS.length];

  return (
    <div className={`bg-[var(--color-surface-card)] p-6 rounded-2xl shadow-[var(--shadow-organic)] border border-[var(--color-border)] transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 ${accentClass}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[var(--color-text-secondary)] text-sm font-medium">{title}</h3>
      </div>
      <div className="flex items-end gap-3">
        <p className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">{value}</p>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${
            trend === 'up'
              ? 'badge-cyan font-semibold'
              : trend === 'down'
              ? 'badge-fuchsia font-semibold'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
