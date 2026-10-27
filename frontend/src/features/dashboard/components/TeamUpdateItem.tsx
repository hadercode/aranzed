export interface TeamUpdateItemProps {
  name: string;
  action: string;
}

export function TeamUpdateItem({ name, action }: TeamUpdateItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[var(--color-surface-hover)] rounded-full shrink-0"></div>
      <div>
        <p className="font-medium text-sm text-[var(--color-text-primary)]">{name}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{action}</p>
      </div>
    </div>
  );
}
