import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface TransactionFormErrorStateProps {
  error: string | null;
  onBack: () => void;
}

export function TransactionFormErrorState({ error, onBack }: TransactionFormErrorStateProps) {
  return (
    <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 mx-auto flex items-center justify-center">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
        Error al Cargar Transacción
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {error || 'No se pudo recuperar la información de la transacción de inventario seleccionada.'}
      </p>
      <div className="pt-2">
        <Button onClick={onBack}>Regresar al Listado</Button>
      </div>
    </div>
  );
}
