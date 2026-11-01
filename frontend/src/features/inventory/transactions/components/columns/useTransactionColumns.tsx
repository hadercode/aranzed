import { useMemo } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import type { DataTableColumn } from "@/shared/components/ui";
import type { InventoryTransaction } from "../../types";
import {
  getTransactionTypeBadge,
  getTransactionStatusBadge,
} from "../details/TransactionBadges";
import { TransactionRowActions } from "./TransactionRowActions";

interface UseTransactionColumnsOptions {
  onViewDetails: (tx: InventoryTransaction) => void;
  onCancelTx: (tx: InventoryTransaction) => void;
  onEdit?: (tx: InventoryTransaction) => void;
}

export function useTransactionColumns({
  onViewDetails,
  onCancelTx,
  onEdit,
}: UseTransactionColumnsOptions): DataTableColumn<InventoryTransaction>[] {
  return useMemo(
    () => [
      {
        key: "transactionNumber",
        title: "Nº Transacción",
        sortable: true,
        render: (tx) => (
          <div>
            <span className="font-mono font-semibold text-xs text-[var(--color-sage-600)] block">
              {tx.transactionNumber}
            </span>
            {tx.referenceEntityId && (
              <span className="text-[11px] text-[var(--color-text-muted)] font-mono block">
                Ref: {tx.referenceEntityId}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "movementDate",
        title: "Fecha",
        sortable: true,
        render: (tx) => (
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] font-mono">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {tx.movementDate ? tx.movementDate.slice(0, 10) : "—"}
          </span>
        ),
      },
      {
        key: "type",
        title: "Tipo",
        sortable: true,
        render: (tx) => getTransactionTypeBadge(tx.type),
      },
      {
        key: "originWarehouse",
        title: "Origen / Destino",
        render: (tx) => {
          if (tx.type === "TRANSFER") {
            return (
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <span className="font-medium text-[var(--color-text-primary)]">
                  {tx.originWarehouse?.name || "Origen"}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-medium text-[var(--color-text-primary)]">
                  {tx.destWarehouse?.name || "Destino"}
                </span>
              </div>
            );
          }
          if (tx.originWarehouse) {
            return (
              <span className="text-xs text-[var(--color-text-secondary)]">
                Desde: {tx.originWarehouse.name}
              </span>
            );
          }
          if (tx.destWarehouse) {
            return (
              <span className="text-xs text-[var(--color-text-secondary)]">
                Hacia: {tx.destWarehouse.name}
              </span>
            );
          }
          return (
            <span className="text-xs text-[var(--color-text-muted)]">—</span>
          );
        },
      },
      {
        key: "reason",
        title: "Motivo",
        render: (tx) => (
          <span className="text-xs text-[var(--color-text-secondary)]">
            {tx.reason?.name || "—"}
          </span>
        ),
      },
      {
        key: "itemsCount",
        title: "Ítems",
        render: (tx) => (
          <span className="text-xs font-mono font-medium text-[var(--color-text-primary)]">
            {tx.items?.length || 0}
          </span>
        ),
      },
      {
        key: "status",
        title: "Estado",
        sortable: true,
        render: (tx) => getTransactionStatusBadge(tx.status),
      },
      {
        key: "actions",
        title: "Acciones",
        align: "right",
        render: (tx) => (
          <TransactionRowActions
            tx={tx}
            onViewDetails={onViewDetails}
            onCancelTx={onCancelTx}
            onEdit={onEdit}
          />
        ),
      },
    ],
    [onViewDetails, onCancelTx, onEdit],
  );
}
