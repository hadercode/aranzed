import { AlertCircle } from 'lucide-react';

export interface SalePaymentFormFeedbackProps {
  error: string | null;
}

export function SalePaymentFormFeedback({ error }: SalePaymentFormFeedbackProps) {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 font-medium animate-in fade-in">
      <AlertCircle className="w-5 h-5 shrink-0" />
      <span>{error}</span>
    </div>
  );
}
