import { useMemo } from 'react';
import type { Sale } from '../../types';
import type { Column } from '@/shared/components/ui/Table';
import { SaleTypeBadge } from '../../components/table/SaleTypeBadge';
import { SalesStatusBadge, SalesPaidBadge, SaleRowActionsDropdown } from '../../components/table';
import {
  SaleNumberCell,
  SalePaymentTermCell,
  SaleDateCell,
  SaleCustomerCell,
  SaleTotalAmountCell,
  SaleBalanceCell,
} from '../../components/table/SaleDatePaymentCells';

export interface UseSalesTableColumnsProps {
  onPreview: (sale: Sale) => void;
  onPrint: (sale: Sale) => void;
  onWhatsAppReminder: (sale: Sale) => void;
  onEdit: (id: string) => void;
  onConfirm: (sale: Sale) => void;
  onConvert: (sale: Sale) => void;
  onCancel: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
  onOpenQuickPayment?: (sale: Sale) => void;
  onOpenCloseManual?: (sale: Sale) => void;
  onOpenPaymentsHistory?: (sale: Sale) => void;
}

export function useSalesTableColumns({
  onPreview,
  onPrint,
  onWhatsAppReminder,
  onEdit,
  onConfirm,
  onConvert,
  onCancel,
  onDelete,
  onOpenQuickPayment,
  onOpenCloseManual,
  onOpenPaymentsHistory,
}: UseSalesTableColumnsProps): Column<Sale>[] {
  return useMemo(
    () => [
      {
        key: 'saleNumber',
        title: 'N° Documento',
        render: (sale: Sale) => <SaleNumberCell sale={sale} />,
      },
      {
        key: 'saleType',
        title: 'Tipo',
        render: (sale: Sale) => <SaleTypeBadge type={sale.saleType} />,
      },
      {
        key: 'paymentTerm',
        title: 'Condición',
        render: (sale: Sale) => <SalePaymentTermCell sale={sale} />,
      },
      {
        key: 'saleDate',
        title: 'Fecha',
        render: (sale: Sale) => <SaleDateCell sale={sale} />,
      },
      {
        key: 'customerName',
        title: 'Cliente',
        render: (sale: Sale) => <SaleCustomerCell sale={sale} />,
      },
      {
        key: 'total',
        title: 'Importe Total',
        align: 'right',
        render: (sale: Sale) => <SaleTotalAmountCell sale={sale} />,
      },
      {
        key: 'balance',
        title: 'Saldo Actual',
        align: 'right',
        render: (sale: Sale) => <SaleBalanceCell sale={sale} />,
      },
      {
        key: 'paidStatus',
        title: 'Estado Pago',
        align: 'center',
        render: (sale: Sale) =>
          sale.saleType === 'QUOTATION' ? (
            <span className="text-xs text-[var(--color-text-muted)] italic">N/A</span>
          ) : (
            <SalesPaidBadge paidStatus={sale.paidStatus} />
          ),
      },
      {
        key: 'status',
        title: 'Estado Doc.',
        align: 'center',
        render: (sale: Sale) => <SalesStatusBadge status={sale.status} />,
      },
      {
        key: 'actions',
        title: 'Acciones',
        align: 'right',
        render: (sale: Sale) => (
          <SaleRowActionsDropdown
            sale={sale}
            onPreview={onPreview}
            onPrint={onPrint}
            onWhatsAppReminder={onWhatsAppReminder}
            onEdit={onEdit}
            onConfirm={onConfirm}
            onConvert={onConvert}
            onCancel={onCancel}
            onDelete={onDelete}
            onOpenQuickPayment={onOpenQuickPayment}
            onOpenCloseManual={onOpenCloseManual}
            onOpenPaymentsHistory={onOpenPaymentsHistory}
          />
        ),
      },
    ],
    [
      onPreview,
      onPrint,
      onWhatsAppReminder,
      onEdit,
      onConfirm,
      onConvert,
      onCancel,
      onDelete,
      onOpenQuickPayment,
      onOpenCloseManual,
      onOpenPaymentsHistory,
    ]
  );
}
