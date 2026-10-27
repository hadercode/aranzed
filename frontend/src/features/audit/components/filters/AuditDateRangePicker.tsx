import { Calendar } from 'lucide-react';

interface AuditDateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function AuditDateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: AuditDateRangePickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
      <span className="flex items-center gap-1.5 font-medium">
        <Calendar className="w-3.5 h-3.5 text-gray-400" />
        <span>Rango de fechas:</span>
      </span>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)]"
        />
        <span>hasta</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)]"
        />
      </div>
    </div>
  );
}

export default AuditDateRangePicker;
