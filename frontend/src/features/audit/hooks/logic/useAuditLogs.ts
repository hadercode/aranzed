import { useState, useEffect, useCallback } from 'react';
import type { AuditLog, AuditDetailTab } from '../../types/audit';
import { useAuditLogsQuery } from '../queries/useAuditLogsQuery';

export function useAuditLogs() {
  const {
    logs,
    stats,
    totalPages,
    totalItems,
    loading,
    error,
    fetchLogs: queryFetchLogs,
  } = useAuditLogsQuery();

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Detail Modal State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<AuditDetailTab>('diff');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fetchLogs = useCallback(() => {
    queryFetchLogs({
      currentPage,
      itemsPerPage,
      searchTerm,
      selectedModel,
      selectedAction,
      selectedStatus,
      startDate,
      endDate,
    });
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedModel,
    selectedAction,
    selectedStatus,
    startDate,
    endDate,
    queryFetchLogs,
  ]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Handlers with automatic page reset
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleModelChange = (val: string) => {
    setSelectedModel(val);
    setCurrentPage(1);
  };

  const handleActionChange = (val: string) => {
    setSelectedAction(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setCurrentPage(1);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedModel('');
    setSelectedAction('');
    setSelectedStatus('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const exportToJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `audit_logs_${new Date().toISOString().split('T')[0]}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const openLogDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailOpen(true);
  };

  const closeLogDetail = () => {
    setIsDetailOpen(false);
  };

  return {
    logs,
    stats,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedModel,
    setSelectedModel,
    selectedAction,
    setSelectedAction,
    selectedStatus,
    setSelectedStatus,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,
    selectedLog,
    isDetailOpen,
    activeDetailTab,
    setActiveDetailTab,
    copiedField,
    fetchLogs,
    handleSearchChange,
    handleModelChange,
    handleActionChange,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    handleItemsPerPageChange,
    handlePageChange,
    clearAllFilters,
    copyToClipboard,
    exportToJson,
    openLogDetail,
    closeLogDetail,
  };
}

export type UseAuditLogsReturn = ReturnType<typeof useAuditLogs>;
