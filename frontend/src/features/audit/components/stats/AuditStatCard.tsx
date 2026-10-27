import type { ReactNode } from 'react';

interface AuditStatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: ReactNode;
  valueClassName?: string;
}

export function AuditStatCard({
  title,
  value,
  subtitle,
  icon,
  valueClassName = 'text-[var(--color-text-primary)]',
}: AuditStatCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-sm">
      <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-secondary)]">
        <span>{title}</span>
        {icon}
      </div>
      <div className={`mt-2 text-2xl font-bold ${valueClassName}`}>{value}</div>
      <div className="mt-1 text-[11px] text-[var(--color-text-muted)]">{subtitle}</div>
    </div>
  );
}

export default AuditStatCard;
