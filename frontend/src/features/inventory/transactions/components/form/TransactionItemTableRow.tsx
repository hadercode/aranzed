import { Trash2 } from 'lucide-react';
import { StaticTable, TextInput, Select } from '@/shared/components/ui';
import type { TransactionFormItem } from '../../hooks/logic/useTransactionFormItems';

interface TransactionItemTableRowProps {
  row: TransactionFormItem;
  idx: number;
  isEditMode: boolean;
  isCostEditable: boolean;
  products: Array<{ id: string; name: string; sku: string; cost?: number }>;
  onSelectProduct: (index: number, productId: string) => void;
  onUpdateItem: (index: number, patch: Partial<TransactionFormItem>) => void;
  onRemoveItem: (index: number) => void;
}

export function TransactionItemTableRow({
  row,
  idx,
  isEditMode,
  isCostEditable,
  products,
  onSelectProduct,
  onUpdateItem,
  onRemoveItem,
}: TransactionItemTableRowProps) {
  const subtotal = Number(row.quantity || 0) * Number(row.cost || 0);

  return (
    <StaticTable.Row>
      <StaticTable.Td>
        {isEditMode ? (
          <div>
            <span className="font-medium text-[var(--color-text-primary)] block">
              {row.nameSnapshot}
            </span>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              SKU: {row.skuSnapshot}
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            <Select
              value={row.productId}
              onChange={(e) => onSelectProduct(idx, e.target.value)}
              options={[
                { value: '', label: 'Seleccionar artículo...' },
                ...products.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.sku})`,
                })),
              ]}
            />
            {row.uomSymbol && (
              <span className="text-xs text-[var(--color-text-muted)] block pl-1">
                Unidad: {row.uomSymbol}
              </span>
            )}
          </div>
        )}
      </StaticTable.Td>

      <StaticTable.Td align="right">
        <TextInput
          type="number"
          min={0.001}
          step="any"
          disabled={isEditMode}
          value={row.quantity === 0 ? '' : row.quantity}
          onChange={(e) => onUpdateItem(idx, { quantity: e.target.value === '' ? 0 : Number(e.target.value) })}
          className="text-right font-mono"
        />
      </StaticTable.Td>

      <StaticTable.Td align="right">
        <TextInput
          type="number"
          min={0}
          step="any"
          disabled={!isCostEditable || isEditMode}
          value={row.cost === 0 ? '' : row.cost}
          onChange={(e) => onUpdateItem(idx, { cost: e.target.value === '' ? 0 : Number(e.target.value) })}
          className="text-right font-mono"
        />
      </StaticTable.Td>

      <StaticTable.Td align="right">
        <span className="font-mono font-bold text-sm text-[var(--color-text-primary)]">
          ${subtotal.toFixed(2)}
        </span>
      </StaticTable.Td>

      <StaticTable.Td>
        <TextInput
          type="text"
          placeholder="Ej: LOTE-001"
          disabled={isEditMode}
          value={row.batchNumber || ''}
          onChange={(e) => onUpdateItem(idx, { batchNumber: e.target.value })}
          className="font-mono text-xs"
        />
      </StaticTable.Td>

      <StaticTable.Td>
        <TextInput
          type="date"
          disabled={isEditMode}
          value={row.expiryDate || ''}
          onChange={(e) => onUpdateItem(idx, { expiryDate: e.target.value })}
          className="text-xs"
        />
      </StaticTable.Td>

      <StaticTable.Td>
        <TextInput
          type="text"
          placeholder="Nota o motivo específico..."
          value={row.customComment || ''}
          onChange={(e) => onUpdateItem(idx, { customComment: e.target.value })}
          className="text-xs"
        />
      </StaticTable.Td>

      {!isEditMode && (
        <StaticTable.Td align="center">
          <button
            type="button"
            onClick={() => onRemoveItem(idx)}
            className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            title="Eliminar renglón"
          >
            <Trash2 size={16} />
          </button>
        </StaticTable.Td>
      )}
    </StaticTable.Row>
  );
}
