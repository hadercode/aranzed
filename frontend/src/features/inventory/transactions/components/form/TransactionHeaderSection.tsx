import { Warehouse as WarehouseIcon, Calendar, FileCheck2, Tag } from 'lucide-react';
import { TextInput, Select } from '@/shared/components/ui';
import type { InventoryTransactionStatus } from '../../types';
import type { UseTransactionFormReturn } from '../../hooks/useTransactionForm';
import { TransactionTypeSelector } from './TransactionTypeSelector';

interface TransactionHeaderSectionProps {
  formContext: UseTransactionFormReturn;
}

export function TransactionHeaderSection({
  formContext,
}: TransactionHeaderSectionProps) {
  const {
    txType,
    setTxType,
    movementDate,
    setMovementDate,
    originWarehouseId,
    setOriginWarehouseId,
    destWarehouseId,
    setDestWarehouseId,
    reasonId,
    setReasonId,
    status,
    setStatus,
    warehouses,
    filteredReasons,
    isEditMode,
  } = formContext;

  const showOrigin = txType === 'ISSUE' || txType === 'TRANSFER';
  const showDest = txType === 'RECEPTION' || txType === 'TRANSFER' || txType === 'ADJUSTMENT';

  return (
    <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
      <TransactionTypeSelector txType={txType} setTxType={setTxType} isEditMode={isEditMode} />

      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          2. Almacenes y Fecha
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextInput
            label="Fecha del Movimiento *"
            type="date"
            value={movementDate}
            onChange={(e) => setMovementDate(e.target.value)}
            leftIcon={<Calendar size={18} />}
          />

          {showOrigin && (
            <Select
              label="Almacén de Origen *"
              value={originWarehouseId}
              disabled={isEditMode}
              onChange={(e) => setOriginWarehouseId(e.target.value)}
              leftIcon={<WarehouseIcon size={18} />}
              options={[
                { value: '', label: 'Seleccionar almacén origen' },
                ...warehouses.map((w) => ({
                  value: w.id,
                  label: `${w.name} (${w.code})`,
                })),
              ]}
            />
          )}

          {showDest && (
            <Select
              label={txType === 'ADJUSTMENT' ? 'Almacén Auditado *' : 'Almacén de Destino *'}
              value={destWarehouseId}
              disabled={isEditMode}
              onChange={(e) => setDestWarehouseId(e.target.value)}
              leftIcon={<WarehouseIcon size={18} />}
              options={[
                { value: '', label: 'Seleccionar almacén destino' },
                ...warehouses.map((w) => ({
                  value: w.id,
                  label: `${w.name} (${w.code})`,
                })),
              ]}
            />
          )}

          <Select
            label="Motivo del Movimiento"
            value={reasonId}
            disabled={isEditMode}
            onChange={(e) => setReasonId(e.target.value)}
            leftIcon={<Tag size={18} />}
            options={[
              { value: '', label: 'Seleccionar motivo (opcional)' },
              ...filteredReasons.map((r) => ({
                value: r.id,
                label: r.name,
              })),
            ]}
          />

          <Select
            label="Estado del Movimiento"
            value={status}
            onChange={(e) => setStatus(e.target.value as InventoryTransactionStatus)}
            leftIcon={<FileCheck2 size={18} />}
            options={[
              { value: 'COMPLETED', label: 'Completado (Afecta Stock)' },
              { value: 'DRAFT', label: 'Borrador (Sin afectar stock)' },
              { value: 'IN_TRANSIT', label: 'En Tránsito (Para transferencias)' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default TransactionHeaderSection;
