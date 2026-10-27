import { ProductsProvider } from '../context';
import {
  ProductsPageHeader,
  ProductsStatsCards,
  ProductsFilterBar,
  ProductsErrorBanner,
  ProductsTable,
  ProductsDialogs,
} from '../components';

function ProductsPageContent() {
  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header with title and New Product action */}
      <ProductsPageHeader />

      {/* KPI / Metric Cards */}
      <ProductsStatsCards />

      {/* Filter and Search Bar */}
      <ProductsFilterBar />

      {/* Error Alert Banner */}
      <ProductsErrorBanner />

      {/* Products Table & Pagination */}
      <ProductsTable />

      {/* Confirm & Success Feedback Dialogs */}
      <ProductsDialogs />
    </div>
  );
}

export function ProductsPage() {
  return (
    <ProductsProvider>
      <ProductsPageContent />
    </ProductsProvider>
  );
}

export default ProductsPage;
