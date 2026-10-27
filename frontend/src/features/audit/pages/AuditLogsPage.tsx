import { AuditProvider } from "../context";
import {
  AuditPageHeader,
  AuditStatsCards,
  AuditFilterBar,
  AuditErrorBanner,
  AuditLogsTable,
  AuditDetailModal,
} from "../components";

function AuditLogsPageContent() {
  return (
    <div className="space-y-6 max-w-8xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Header with title and refresh / export actions */}
      <AuditPageHeader />

      {/* KPI / Metric Cards */}
      <AuditStatsCards />

      {/* Filter and Search Panel */}
      <AuditFilterBar />

      {/* Error Alert Banner */}
      <AuditErrorBanner />

      {/* Table & Pagination */}
      <AuditLogsTable />

      {/* Detail Modal with diff, metadata and JSON tabs */}
      <AuditDetailModal />
    </div>
  );
}

export function AuditLogsPage() {
  return (
    <AuditProvider>
      <AuditLogsPageContent />
    </AuditProvider>
  );
}

export default AuditLogsPage;
