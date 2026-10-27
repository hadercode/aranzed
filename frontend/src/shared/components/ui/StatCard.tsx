import { type ReactNode } from 'react';

export type StatCardColor =
  | 'cyan'
  | 'fuchsia'
  | 'purple'
  | 'yellow'
  | 'orange'
  | 'emerald'
  | 'blue'
  | 'amber'
  | 'rose'
  | 'teal'
  | 'gray';

export interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  description?: string | ReactNode;
  icon?: ReactNode;
  color?: StatCardColor;
  valueColorClass?: string;
  iconColorClass?: string;
  hoverBorderClass?: string;
  className?: string;
  onClick?: () => void;
}

const colorStyles: Record<
  StatCardColor,
  {
    iconBox: string;
    hoverBorder: string;
    defaultValueColor: string;
    topBar: string;
  }
> = {
  cyan: {
    iconBox: 'bg-cyan-500/15 text-[#22B2B8] dark:text-[#38D5DB]',
    hoverBorder: 'hover:border-[#22B2B8]/40 hover:shadow-cyan-500/10 hover:shadow-md',
    defaultValueColor: 'text-[#22B2B8] dark:text-[#38D5DB]',
    topBar: 'before:bg-[#22B2B8]',
  },
  fuchsia: {
    iconBox: 'bg-pink-500/15 text-[#F43F5E] dark:text-[#FB7185]',
    hoverBorder: 'hover:border-[#F43F5E]/40 hover:shadow-pink-500/10 hover:shadow-md',
    defaultValueColor: 'text-[#F43F5E] dark:text-[#FB7185]',
    topBar: 'before:bg-[#F43F5E]',
  },
  purple: {
    iconBox: 'bg-purple-500/15 text-[#8B5CF6] dark:text-[#A78BFA]',
    hoverBorder: 'hover:border-[#8B5CF6]/40 hover:shadow-purple-500/10 hover:shadow-md',
    defaultValueColor: 'text-[#8B5CF6] dark:text-[#A78BFA]',
    topBar: 'before:bg-[#8B5CF6]',
  },
  yellow: {
    iconBox: 'bg-amber-500/15 text-[#F59E0B] dark:text-[#FBBF24]',
    hoverBorder: 'hover:border-[#F59E0B]/40 hover:shadow-amber-500/10 hover:shadow-md',
    defaultValueColor: 'text-[#F59E0B] dark:text-[#FBBF24]',
    topBar: 'before:bg-[#F59E0B]',
  },
  orange: {
    iconBox: 'bg-orange-500/15 text-[#F97316] dark:text-[#FB923C]',
    hoverBorder: 'hover:border-[#F97316]/40 hover:shadow-orange-500/10 hover:shadow-md',
    defaultValueColor: 'text-[#F97316] dark:text-[#FB923C]',
    topBar: 'before:bg-[#F97316]',
  },
  emerald: {
    iconBox: 'bg-cyan-500/15 text-[#22B2B8] dark:text-[#38D5DB]',
    hoverBorder: 'hover:border-[#22B2B8]/30',
    defaultValueColor: 'text-[#22B2B8] dark:text-[#38D5DB]',
    topBar: 'before:bg-[#22B2B8]',
  },
  blue: {
    iconBox: 'bg-purple-500/15 text-[#8B5CF6] dark:text-[#A78BFA]',
    hoverBorder: 'hover:border-[#8B5CF6]/30',
    defaultValueColor: 'text-[var(--color-text-primary)]',
    topBar: 'before:bg-[#8B5CF6]',
  },
  amber: {
    iconBox: 'bg-amber-500/15 text-[#F59E0B] dark:text-[#FBBF24]',
    hoverBorder: 'hover:border-[#F59E0B]/30',
    defaultValueColor: 'text-[#F59E0B] dark:text-[#FBBF24]',
    topBar: 'before:bg-[#F59E0B]',
  },
  rose: {
    iconBox: 'bg-pink-500/15 text-[#F43F5E] dark:text-[#FB7185]',
    hoverBorder: 'hover:border-[#F43F5E]/30',
    defaultValueColor: 'text-[#F43F5E] dark:text-[#FB7185]',
    topBar: 'before:bg-[#F43F5E]',
  },
  teal: {
    iconBox: 'bg-cyan-500/15 text-[#22B2B8] dark:text-[#38D5DB]',
    hoverBorder: 'hover:border-[#22B2B8]/30',
    defaultValueColor: 'text-[#22B2B8] dark:text-[#38D5DB]',
    topBar: 'before:bg-[#22B2B8]',
  },
  gray: {
    iconBox: 'bg-gray-500/10 text-[var(--color-text-secondary)]',
    hoverBorder: 'hover:border-gray-500/30',
    defaultValueColor: 'text-[var(--color-text-primary)]',
    topBar: 'before:bg-gray-400',
  },
};

export function StatCard({
  title,
  value,
  description,
  icon,
  color = 'blue',
  valueColorClass,
  iconColorClass,
  hoverBorderClass,
  className = '',
  onClick,
}: StatCardProps) {
  const styles = colorStyles[color] || colorStyles.blue;
  const resolvedValueColor = valueColorClass || styles.defaultValueColor;
  const resolvedIconBox = iconColorClass || styles.iconBox;
  const resolvedHover = hoverBorderClass || styles.hoverBorder;

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-sm transition-all relative overflow-hidden before:absolute before:top-0 before:left-0 before:right-0 before:h-1 ${styles.topBar} ${resolvedHover} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            {title}
          </p>
          <div className={`text-2xl font-bold mt-1 ${resolvedValueColor}`}>
            {value}
          </div>
        </div>
        {icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${resolvedIconBox}`}
          >
            {icon}
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-[var(--color-text-muted)] mt-3">
          {description}
        </p>
      )}
    </div>
  );
}

export default StatCard;
