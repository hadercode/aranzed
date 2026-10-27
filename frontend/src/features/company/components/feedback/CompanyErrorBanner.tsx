import { AlertCircle } from 'lucide-react';
import { useCompanyContext } from '../../context';

export function CompanyErrorBanner() {
  const { mutationError, fetchError, clearMessages } = useCompanyContext();

  if (!mutationError && !fetchError) return null;

  return (
    <div className="alert-danger flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-xs animate-in slide-in-from-top-2">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">{mutationError || fetchError}</p>
      </div>
      {mutationError && (
        <button
          type="button"
          onClick={clearMessages}
          className="text-xs font-semibold underline cursor-pointer hover:opacity-80"
        >
          Cerrar
        </button>
      )}
    </div>
  );
}

export default CompanyErrorBanner;
