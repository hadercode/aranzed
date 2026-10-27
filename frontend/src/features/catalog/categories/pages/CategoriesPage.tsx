import { CategoriesProvider } from '../context';
import {
  CategoriesPageHeader,
  CategoriesStatsCards,
  CategoriesFilterBar,
  CategoriesErrorBanner,
  CategoriesTable,
  CategoryFormModal,
  CategoriesDialogs,
} from '../components';

function CategoriesPageContent() {
  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header with title and New Category action */}
      <CategoriesPageHeader />

      {/* KPI / Metric Cards */}
      <CategoriesStatsCards />

      {/* Filter and Search Bar */}
      <CategoriesFilterBar />

      {/* Error Alert Banner */}
      <CategoriesErrorBanner />

      {/* Hierarchical Categories Table & Pagination */}
      <CategoriesTable />

      {/* Create / Edit Modal */}
      <CategoryFormModal />

      {/* Confirm & Success Feedback Dialogs */}
      <CategoriesDialogs />
    </div>
  );
}

export function CategoriesPage() {
  return (
    <CategoriesProvider>
      <CategoriesPageContent />
    </CategoriesProvider>
  );
}

export default CategoriesPage;
