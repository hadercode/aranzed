import { AlertTriangle, CheckCircle2, Info, Bell } from 'lucide-react';

export interface TeamUpdateItemProps {
  name: string;
  action: string;
  type?: 'warning' | 'info' | 'success';
}

export function TeamUpdateItem({ name, action, type = 'info' }: TeamUpdateItemProps) {
  const iconConfig = {
    warning: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    success: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    info: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
      icon: <Info className="w-5 h-5" />,
    },
  }[type] || {
    bg: 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]',
    icon: <Bell className="w-5 h-5" />,
  };

  return (
    <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconConfig.bg}`}>
        {iconConfig.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{name}</p>
        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mt-0.5">{action}</p>
      </div>
    </div>
  );
}
