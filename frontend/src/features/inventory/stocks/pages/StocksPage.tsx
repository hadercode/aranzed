import { useState } from "react";
import { Layers, RefreshCw, UploadCloud } from "lucide-react";
import { Button, PageHeader } from "@/shared/components/ui";
import { useStocksQuery } from "../hooks";
import { useWarehousesQuery } from "../../warehouses/hooks";
import { stocksService } from "../services";
import {
  StockStatsCards,
  StockFilterBar,
  StockTable,
  StockLedgerModal,
  StockBulkImportModal,
} from "../components";
import type { StockLedgerEntry } from "../types";

export function StocksPage() {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [excludeDepleted, setExcludeDepleted] = useState<boolean>(true);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState<boolean>(false);

  const { warehouses } = useWarehousesQuery();
  const { stocks, stats, isLoading, refetch } = useStocksQuery({
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
      >
        <Button
          type="button"
          variant="secondary"
          onClick={() => void refetch()}
          loading={isLoading}
          leftIcon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Actualizar
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsBulkImportOpen(true)}
          leftIcon={<UploadCloud className="w-4 h-4" />}
        >
          Carga Masiva de Saldos
        </Button>
      </PageHeader>

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

      <StockBulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportSuccess={() => void refetch()}
      />
    </div>
  );
}
