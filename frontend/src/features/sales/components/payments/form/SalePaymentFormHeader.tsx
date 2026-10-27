import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export interface SalePaymentFormHeaderProps {
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function SalePaymentFormHeader({
  onCancel,
  onSubmit,
  isSubmitting,
}: SalePaymentFormHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] transition-colors"
          title="Regresar al listado"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <nav className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
            <span>Ventas</span>
            <span>/</span>
            <span>Cobros</span>
            <span>/</span>
            <span className="text-sage-600 font-medium">Nuevo Registro</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            Registrar Cobro y Cruzar con Ventas
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Aplica un pago único o transferencia bancaria contra una o múltiples facturas pendientes del cliente.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          leftIcon={<X className="w-4 h-4" />}
        >
          Descartar
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onSubmit}
          loading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Registrar Cobro
        </Button>
      </div>
    </div>
  );
}
