import type {
  InventoryTransactionType,
  InventoryTransactionStatus,
} from "../../types";

export function getTransactionTypeBadge(type: InventoryTransactionType) {
  switch (type) {
    case "RECEPTION":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          Entrada (+)
        </span>
      );
    case "ISSUE":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
          Salida (-)
        </span>
      );
    case "TRANSFER":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
          Transferencia (⇄)
        </span>
      );
    case "ADJUSTMENT":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
          Ajuste (+/-)
        </span>
      );
    default:
      return <span className="text-xs">{type}</span>;
  }
}

export function getTransactionStatusBadge(status: InventoryTransactionStatus) {
  switch (status) {
    case "COMPLETED":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
          Completada
        </span>
      );
    case "DRAFT":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-500/20">
          Borrador
        </span>
      );
    case "IN_TRANSIT":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20">
          En Tránsito
        </span>
      );
    case "CANCELLED":
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-500/20">
          Anulada
        </span>
      );
    default:
      return <span className="text-xs">{status}</span>;
  }
}
