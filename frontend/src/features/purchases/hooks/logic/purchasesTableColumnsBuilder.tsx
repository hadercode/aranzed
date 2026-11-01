import { Calendar, FileText } from 'lucide-react';
import type { DataTableColumn } from '@/shared/components/ui';
import type { Purchase } from '../../types';
import { PurchasesStatusBadge } from '../../components/table/PurchasesStatusBadge';
import {
  PurchaseNumberCell,
  PurchaseSubtotalCell,
  PurchaseTotalCell,
} from '../../components/table/PurchaseTableMoneyCells';
import { PurchaseTableRowActions } from '../../components/table/PurchaseTableRowActions';

export interface BuildPurchasesColumnsParams {
  functionalCurrency: string;
  functionalSymbol: string;
  localCurrency: string;
  localSymbol: string;
  onView: (purchase: Purchase) => void;
  onComplete: (purchase: Purchase) => void;
  onDelete: (purchase: Purchase) => void;
}

export function buildPurchasesTableColumns(params: BuildPurchasesColumnsParams): DataTableColumn<Purchase>[] {
  const { functionalCurrency, functionalSymbol, localCurrency, localSymbol, onView, onComplete, onDelete } = params;

  return [
    {
      key: 'purchaseNumber',
      title: 'N° Compra',
      sortable: true,
      render: (p) => (
        <PurchaseNumberCell
          purchase={p}
          localCurrency={localCurrency}
          localSymbol={localSymbol}
          functionalCurrency={functionalCurrency}
          functionalSymbol={functionalSymbol}
        />
      ),
    },
    {
      key: 'supplierName',
      title: 'Proveedor',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-medium text-[var(--color-text-primary)]">{p.supplierName}</span>
          {p.description && <p className="text-xs text-[var(--color-text-muted)] truncate max-w-xs">{p.description}</p>}
        </div>
      ),
    },
    {
      key: 'invoiceNumber',
      title: 'N° Factura',
      sortable: true,
      render: (p) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] font-mono">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          {p.invoiceNumber || '—'}
        </span>
      ),
    },
    {
      key: 'purchaseDate',
      title: 'Fecha',
      sortable: true,
      render: (p) => (
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(p.purchaseDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: '2-digit' })}
        </span>
      ),
    },
    {
      key: 'exchangeRate',
      title: `Tasa (${localSymbol}/${functionalSymbol})`,
      align: 'center',
      sortable: true,
      render: (p) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-blue-500/10 text-blue-700 dark:text-blue-400">
          {(Number(p.exchangeRate) || 1.0).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
        </span>
      ),
    },
    {
      key: 'items',
      title: 'Materiales',
      align: 'center',
      render: (p) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/10 text-[var(--color-text-secondary)]">
          {p.items?.length || 0} ítems
        </span>
      ),
    },
    {
      key: 'subtotal',
      title: `Subtotal (${functionalSymbol} / ${localSymbol})`,
      align: 'right',
      sortable: true,
      render: (p) => <PurchaseSubtotalCell purchase={p} functionalSymbol={functionalSymbol} localSymbol={localSymbol} />,
    },
    {
      key: 'total',
      title: `Total (${functionalSymbol} / ${localSymbol})`,
      align: 'right',
      sortable: true,
      render: (p) => <PurchaseTotalCell purchase={p} functionalSymbol={functionalSymbol} localSymbol={localSymbol} />,
    },
    {
      key: 'status',
      title: 'Estado',
      align: 'center',
      sortable: true,
      render: (p) => <PurchasesStatusBadge status={p.status} />,
    },
    {
      key: 'actions',
      title: 'Acciones',
      align: 'right',
      render: (p) => <PurchaseTableRowActions purchase={p} onView={onView} onComplete={onComplete} onDelete={onDelete} />,
    },
  ];
}
