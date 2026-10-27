import { AlertCircle } from 'lucide-react';
import { useAuditContext } from '../../context';

export interface AuditErrorBannerProps {
  error?: string | null;
}

export function AuditErrorBanner({ error: propError }: AuditErrorBannerProps) {
  const context = useAuditContext();
  const error = propError !== undefined ? propError : context.error;

  if (!error) return null;

  return (
    <div className="alert-danger p-4 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-950 dark:text-rose-300 text-sm font-medium flex items-center gap-2">
      <AlertCircle className="w-4 h-4 shrink-0 text-rose-700 dark:text-rose-400" />
      <span>{error}</span>
    </div>
  );
}

export default AuditErrorBanner;
