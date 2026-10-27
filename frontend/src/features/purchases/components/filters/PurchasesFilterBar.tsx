import { Filter } from "lucide-react";
import { usePurchasesContext } from "../../context";
import type { PurchaseStatus } from "../../types";
import { SearchInput, Select } from "@/shared/components/ui";

export function PurchasesFilterBar() {
  const {
    searchTerm,
    handleSearchChange,
    statusFilter,
    handleStatusFilterChange,
  } = usePurchasesContext();

  const statusTabs: Array<{ id: PurchaseStatus | "ALL"; label: string }> = [
    { id: "ALL", label: "Todas" },
    { id: "COMPLETED", label: "Completadas" },
    { id: "DRAFT", label: "Borrador" },
    { id: "CANCELLED", label: "Canceladas" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[var(--color-surface-card)] p-4 rounded-2xl border border-[var(--color-border)] shadow-sm">
      {/* Search Input */}
      <SearchInput
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        onClear={() => handleSearchChange("")}
        placeholder="Buscar por proveedor, N° compra o factura..."
        containerClassName="flex-1 max-w-md"
      />

      {/* Status Filter */}
      <Select
        value={statusFilter}
        onChange={(e) => handleStatusFilterChange(e.target.value as PurchaseStatus | 'ALL')}
        options={statusTabs.map((tab) => ({
          value: tab.id,
          label: tab.id === 'ALL' ? 'Todos los estados' : tab.label,
        }))}
        icon={<Filter className="w-4 h-4 text-[var(--color-text-muted)]" />}
        containerClassName="w-full sm:w-56 shrink-0"
        className="py-2 text-sm bg-[var(--color-surface-bg)]"
        aria-label="Filtrar por estado"
      />
    </div>
  );
}

export default PurchasesFilterBar;
