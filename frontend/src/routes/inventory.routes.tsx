import { Route, Navigate } from "react-router-dom";
import {
  WarehousesPage,
  ReasonsPage,
  StocksPage,
  TransactionsPage,
  TransactionFormPage,
  LedgerPage,
  AdjustmentsReportPage,
} from "@/features/inventory";

export const inventoryRoutes = (
  <>
    <Route
      path="/inventory"
      element={<Navigate to="/inventory/stocks" replace />}
    />
    <Route path="/inventory/stocks" element={<StocksPage />} />
    <Route path="/inventory/transactions" element={<TransactionsPage />} />
    <Route
      path="/inventory/transactions/new"
      element={<TransactionFormPage />}
    />
    <Route
      path="/inventory/transactions/:id/edit"
      element={<TransactionFormPage />}
    />
    <Route path="/inventory/warehouses" element={<WarehousesPage />} />
    <Route path="/inventory/reasons" element={<ReasonsPage />} />
    <Route path="/inventory/ledger" element={<LedgerPage />} />
    <Route
      path="/inventory/adjustments-report"
      element={<AdjustmentsReportPage />}
    />
  </>
);

export default inventoryRoutes;
