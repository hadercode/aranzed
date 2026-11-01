import { useState } from 'react';

export function useAuditFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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

  return {
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
    handleSearchChange,
    handleModelChange,
    handleActionChange,
    handleStatusChange,
    handleStartDateChange,
    handleEndDateChange,
    handleItemsPerPageChange,
    handlePageChange,
    clearAllFilters,
  };
}

