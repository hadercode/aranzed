import { Clock, CheckCircle2 } from 'lucide-react';
import { FormGroup } from '@/shared/components/ui';

export interface PurchaseStatusPickerProps {
  currentStatus: string;
  onSelectStatus: (status: 'DRAFT' | 'COMPLETED') => void;
}

export function PurchaseStatusPicker({ currentStatus, onSelectStatus }: PurchaseStatusPickerProps) {
  return (
    <FormGroup label="Estado de Registro" className="md:col-span-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectStatus('DRAFT')}
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            currentStatus === 'DRAFT'
              ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium ring-2 ring-amber-500/20'
              : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]'
          }`}
        >
          <Clock className="w-4 h-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-xs font-semibold">Guardar Borrador</p>
            <p className="text-[10px] opacity-75">No emite stock aún</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectStatus('COMPLETED')}
          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
            currentStatus === 'COMPLETED'
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium ring-2 ring-emerald-500/20'
              : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <div>
            <p className="text-xs font-semibold">Completada (Stock OK)</p>
            <p className="text-[10px] opacity-75">Emite evento a inventario</p>
          </div>
        </button>
      </div>
    </FormGroup>
  );
}

