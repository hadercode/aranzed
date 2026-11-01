import React, { useState, useMemo, useCallback } from 'react';
import { useCompanyQuery, type Company } from '../queries/useCompanyQuery';
import { useCompanyMutations } from '../mutations/useCompanyMutations';
import { useCompanyLogo } from './useCompanyLogo';
import { COMMON_CURRENCIES, TIMEZONES, type CompanyTab } from './company.constants';

export * from './company.constants';

export function useCompanyPage() {
  const { data: company, loading, error: fetchError, refetch } = useCompanyQuery();
  const [activeTab, setActiveTab] = useState<CompanyTab>('general');
  const [editedData, setEditedData] = useState<Partial<Company>>({});
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');
  const [isConfirmDiscardOpen, setIsConfirmDiscardOpen] = useState(false);

  const {
    updateCompany,
    uploadLogo,
    isMutating,
    error: mutationError,
    clearMessages,
  } = useCompanyMutations({
    onSuccess: () => {
      setEditedData({});
      logo.setSelectedFile(null);
    },
  });

  const formData = useMemo<Partial<Company>>(
    () => ({ ...(company || {}), ...editedData }),
    [company, editedData]
  );

  const logo = useCompanyLogo(formData.logoUrl, uploadLogo, clearMessages);

  const hasChanges = useMemo(
    () => Object.keys(editedData).length > 0 || logo.selectedFile !== null,
    [editedData, logo.selectedFile]
  );

  const sampleFormattedPrice = useMemo(() => {
    const symbol = formData.currencySymbol || '$';
    const pos = formData.currencyPosition || 'left';
    return pos === 'left' ? `${symbol} 1,250.00` : `1,250.00 ${symbol}`;
  }, [formData.currencySymbol, formData.currencyPosition]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      clearMessages();
      setEditedData((prev) => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : type === 'number'
            ? value === ''
              ? ''
              : Number(value)
            : value,
      }));
    },
    [clearMessages]
  );

  const handleCurrencySelect = useCallback((code: string) => {
    const curr = COMMON_CURRENCIES.find((c) => c.code === code);
    if (curr) {
      setEditedData((prev) => ({
        ...prev,
        currencyCode: curr.code,
        currencySymbol: curr.symbol,
      }));
    }
  }, []);

  const handleResetChanges = useCallback(() => {
    setEditedData({});
    logo.setSelectedFile(null);
    clearMessages();
    setIsConfirmDiscardOpen(false);
  }, [clearMessages, logo]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      clearMessages();
      try {
        if (logo.selectedFile) {
          logo.setIsUploadingLogo(true);
          await uploadLogo(logo.selectedFile);
          logo.setSelectedFile(null);
          logo.setIsUploadingLogo(false);
        }
        await updateCompany(formData);
        setSuccessMessageText('Datos de la empresa actualizados exitosamente');
        setIsSuccessOpen(true);
      } catch {
        logo.setIsUploadingLogo(false);
      }
    },
    [logo, uploadLogo, updateCompany, formData, clearMessages]
  );

  return {
    company,
    loading,
    fetchError,
    mutationError,
    clearMessages,
    activeTab,
    setActiveTab,
    formData,
    hasChanges,
    previewLogo: logo.previewLogo,
    selectedFile: logo.selectedFile,
    isUploadingLogo: logo.isUploadingLogo,
    isMutating,
    isSaving: isMutating || logo.isUploadingLogo,
    sampleFormattedPrice,
    currencies: COMMON_CURRENCIES,
    timezones: TIMEZONES,
    handleChange,
    handleCurrencySelect,
    handleFileSelect: logo.handleFileSelect,
    handleUploadLogoOnly: logo.handleUploadLogoOnly,
    handleResetChanges,
    handleSubmit,
    isSuccessOpen,
    successMessage: successMessageText,
    closeSuccess: () => {
      setIsSuccessOpen(false);
      setSuccessMessageText('');
    },
    isConfirmDiscardOpen,
    setIsConfirmDiscardOpen,
    refetch,
  };
}
