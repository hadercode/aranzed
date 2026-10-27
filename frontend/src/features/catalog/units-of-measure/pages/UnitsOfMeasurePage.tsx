import { UnitsOfMeasureProvider } from '../context';
import {
  UnitsOfMeasurePageHeader,
  UnitsOfMeasureStatsCards,
  UnitsOfMeasureFilterBar,
  UnitsOfMeasureErrorBanner,
  UnitsOfMeasureTable,
  UnitOfMeasureFormModal,
  UnitsOfMeasureDialogs,
} from '../components';

function UnitsOfMeasurePageContent() {
  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header with title and New Unit action */}
      <UnitsOfMeasurePageHeader />

      {/* KPI / Metric Cards */}
      <UnitsOfMeasureStatsCards />

      {/* Filter and Search Bar */}
      <UnitsOfMeasureFilterBar />

      {/* Error Alert Banner */}
      <UnitsOfMeasureErrorBanner />

      {/* Units of Measure Table & Pagination */}
      <UnitsOfMeasureTable />

      {/* Create / Edit Modal */}
      <UnitOfMeasureFormModal />

      {/* Confirm & Success Feedback Dialogs */}
      <UnitsOfMeasureDialogs />
    </div>
  );
}

export function UnitsOfMeasurePage() {
  return (
    <UnitsOfMeasureProvider>
      <UnitsOfMeasurePageContent />
    </UnitsOfMeasureProvider>
  );
}

export default UnitsOfMeasurePage;
