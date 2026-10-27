import { useState } from "react";
import { Layers } from "lucide-react";
import { PageHeader } from "@/shared/components/ui";
import { useStocksQuery } from "../hooks";
import { useWarehousesQuery } from "../../warehouses/hooks";
import { stocksService } from "../services";
import {
  StockStatsCards,
  StockFilterBar,
  StockTable,
  StockLedgerModal,
} from "../components";
import type { StockLedgerEntry } from "../types";

export function StocksPage() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [excludeDepleted, setExcludeDepleted] = useState<boolean>(true);

  const { warehouses } = useWarehousesQuery();
  const { stocks, stats, isLoading } = useStocksQuery({
    warehouseId: selectedWarehouseId || undefined,
    search: searchTerm || undefined,
    excludeDepleted,
  });

  // Modal para ver Kárdex de un stock particular
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [ledgerEntries, setLedgerEntries] = useState<StockLedgerEntry[]>([]);
  const [loadingLedger, setLoadingLedger] = useState<boolean>(false);

  const handleOpenLedger = async (stockId: string) => {
    setIsLedgerOpen(true);
    setLoadingLedger(true);
    try {
      const data = await stocksService.getLedger({ stockId });
      setLedgerEntries(data);
    } catch (err) {
      console.error("Error al cargar kárdex", err);
    } finally {
      setLoadingLedger(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      <PageHeader
        title="Existencias y Saldos de Inventario"
        description="Consulte el stock físico, apartado y disponible en tiempo real con valuación PEPS (FIFO)."
        icon={<Layers className="w-6 h-6 text-[var(--color-sage-600)]" />}
      />

      <StockStatsCards stats={stats} />

      <StockFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedWarehouseId={selectedWarehouseId}
        onWarehouseChange={setSelectedWarehouseId}
        excludeDepleted={excludeDepleted}
        onExcludeDepletedChange={setExcludeDepleted}
        warehouses={warehouses}
      />

      <StockTable
        stocks={stocks}
        isLoading={isLoading}
        onOpenLedger={handleOpenLedger}
      />

      <StockLedgerModal
        isOpen={isLedgerOpen}
        onClose={() => setIsLedgerOpen(false)}
        entries={ledgerEntries}
        loading={loadingLedger}
      />
    </div>
  );
}
