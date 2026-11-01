import { useCallback } from 'react';
import { useAuditLogsQuery } from '../queries/useAuditLogsQuery';
import { useAuditFilters } from './useAuditFilters';
import { useAuditDetailModal } from './useAuditDetailModal';

export function useAuditLogs() {
  const filters = useAuditFilters();
  const detail = useAuditDetailModal();

  const {
    logs,
    stats,
    totalPages,
    totalItems,
    loading,
    error,
    refetch,
  } = useAuditLogsQuery({
    currentPage: filters.currentPage,
    itemsPerPage: filters.itemsPerPage,
    searchTerm: filters.searchTerm,
    selectedModel: filters.selectedModel,
    selectedAction: filters.selectedAction,
    selectedStatus: filters.selectedStatus,
    startDate: filters.startDate,
    endDate: filters.endDate,
  });

  const exportToJson = useCallback(() => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `audit_logs_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [logs]);

  return {
    logs,
    stats,
    loading,
    error,
    searchTerm: filters.searchTerm,
    setSearchTerm: filters.setSearchTerm,
    selectedModel: filters.selectedModel,
    setSelectedModel: filters.setSelectedModel,
    selectedAction: filters.selectedAction,
    setSelectedAction: filters.setSelectedAction,
    selectedStatus: filters.selectedStatus,
    setSelectedStatus: filters.setSelectedStatus,
    startDate: filters.startDate,
    setStartDate: filters.setStartDate,
    endDate: filters.endDate,
    setEndDate: filters.setEndDate,
    currentPage: filters.currentPage,
    setCurrentPage: filters.setCurrentPage,
    itemsPerPage: filters.itemsPerPage,
    setItemsPerPage: filters.setItemsPerPage,
    totalPages,
    totalItems,
    selectedLog: detail.selectedLog,
    isDetailOpen: detail.isDetailOpen,
    activeDetailTab: detail.activeDetailTab,
    setActiveDetailTab: detail.setActiveDetailTab,
    copiedField: detail.copiedField,
    fetchLogs: refetch,
    handleSearchChange: filters.handleSearchChange,
    handleModelChange: filters.handleModelChange,
    handleActionChange: filters.handleActionChange,
    handleStatusChange: filters.handleStatusChange,
    handleStartDateChange: filters.handleStartDateChange,
    handleEndDateChange: filters.handleEndDateChange,
    handleItemsPerPageChange: filters.handleItemsPerPageChange,
    handlePageChange: filters.handlePageChange,
    clearAllFilters: filters.clearAllFilters,
    copyToClipboard: detail.copyToClipboard,
    exportToJson,
    openLogDetail: detail.openLogDetail,
    closeLogDetail: detail.closeLogDetail,
  };
}

export type UseAuditLogsReturn = ReturnType<typeof useAuditLogs>;
