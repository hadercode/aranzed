import type { SalePayment } from "../../../types";
import { useSalePaymentsTableColumns } from "../../../hooks/logic/useSalePaymentsTableColumns";
import { DataTable } from "@/shared/components/ui";

export interface SalePaymentsTableProps {
  payments: SalePayment[];
  isLoading: boolean;
  total: number;
  onOpenReceipt: (url: string) => void;
  onOpenCancel: (payment: SalePayment) => void;
}

export function SalePaymentsTable({
  payments,
  isLoading,
  total,
  onOpenReceipt,
  onOpenCancel,
}: SalePaymentsTableProps) {
  const columns = useSalePaymentsTableColumns({
    onOpenReceipt,
    onOpenCancel,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-[var(--color-text-muted)]">
          Total de cobros listados:{" "}
          <strong className="text-[var(--color-text-primary)]">{total}</strong>
        </span>
      </div>

      <DataTable<SalePayment>
        data={payments}
        columns={columns}
        loading={isLoading}
        rowKey={(p) => p.id}
        emptyMessage="No se encontraron cobros registrados con los filtros seleccionados."
      />
    </div>
  );
}
