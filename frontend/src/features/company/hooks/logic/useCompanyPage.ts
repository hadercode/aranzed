import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCompanyQuery, type Company } from '../queries/useCompanyQuery';
import { useCompanyMutations } from '../mutations/useCompanyMutations';
import { getAssetUrl } from '@/lib/api-client';

export type CompanyTab =
  | 'general'
  | 'contact'
  | 'currency'
  | 'branding'
  | 'email'
  | 'legal';

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const COMMON_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano (COP)' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano (MXN)' },
  { code: 'PEN', symbol: 'S/.', name: 'Sol Peruano (PEN)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno (CLP)' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino (ARS)' },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño (BRL)' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina (GBP)' },
];

export const TIMEZONES: string[] = [
  'America/Bogota',
  'America/Mexico_City',
  'America/Lima',
  'America/Santiago',
  'America/Caracas',
  'America/Buenos_Aires',
  'America/Montevideo',
  'America/La_Paz',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/Madrid',
  'UTC',
];

export function useCompanyPage() {
  const { data: company, loading, error: fetchError, refetch, setData } = useCompanyQuery();

  const [activeTab, setActiveTab] = useState<CompanyTab>('general');
  const [editedData, setEditedData] = useState<Partial<Company>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Dialog and feedback states
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
    onSuccess: (updated) => {
      setData(updated);
      setEditedData({});
      setSelectedFile(null);
    },
  });

  // Initial load
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Derived effective form data combining server data with local edits
  const formData = useMemo<Partial<Company>>(
    () => ({ ...(company || {}), ...editedData }),
    [company, editedData]
  );

  // Determine if there are uncommitted changes
  const hasChanges = useMemo(
    () => Object.keys(editedData).length > 0 || selectedFile !== null,
    [editedData, selectedFile]
  );

  // Computed logo preview
  const previewLogo = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    if (formData.logoUrl) {
      return getAssetUrl(formData.logoUrl);
    }
    return null;
  }, [selectedFile, formData.logoUrl]);

  // Computed sample currency preview
  const sampleFormattedPrice = useMemo(() => {
    const symbol = formData.currencySymbol || '$';
    const pos = formData.currencyPosition || 'left';
    return pos === 'left' ? `${symbol} 1,250.00` : `1,250.00 ${symbol}`;
  }, [formData.currencySymbol, formData.currencyPosition]);

  // Form input change handler
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
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

  // Currency quick selector
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

  // File selection
  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      clearMessages();
    },
    [clearMessages]
  );

  // Direct logo upload action
  const handleUploadLogoOnly = useCallback(async () => {
    if (!selectedFile) return;
    try {
      setIsUploadingLogo(true);
      await uploadLogo(selectedFile);
      setSelectedFile(null);
      setSuccessMessageText('Logotipo subido y actualizado exitosamente');
      setIsSuccessOpen(true);
    } catch {
      // Error handled by mutation hook
    } finally {
      setIsUploadingLogo(false);
    }
  }, [selectedFile, uploadLogo]);

  // Discard local changes
  const handleResetChanges = useCallback(() => {
    setEditedData({});
    setSelectedFile(null);
    clearMessages();
    setIsConfirmDiscardOpen(false);
  }, [clearMessages]);

  // Submit all changes
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      clearMessages();
      try {
        if (selectedFile) {
          setIsUploadingLogo(true);
          await uploadLogo(selectedFile);
          setSelectedFile(null);
          setIsUploadingLogo(false);
        }
        await updateCompany(formData);
        setSuccessMessageText('Datos de la empresa actualizados exitosamente');
        setIsSuccessOpen(true);
      } catch {
        setIsUploadingLogo(false);
      }
    },
    [selectedFile, uploadLogo, updateCompany, formData, clearMessages]
  );

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSuccessMessageText('');
  };

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
    previewLogo,
    selectedFile,
    isUploadingLogo,
    isMutating,
    isSaving: isMutating || isUploadingLogo,
    sampleFormattedPrice,
    currencies: COMMON_CURRENCIES,
    timezones: TIMEZONES,
    handleChange,
    handleCurrencySelect,
    handleFileSelect,
    handleUploadLogoOnly,
    handleResetChanges,
    handleSubmit,
    isSuccessOpen,
    successMessage: successMessageText,
    closeSuccess,
    isConfirmDiscardOpen,
    setIsConfirmDiscardOpen,
    refetch,
  };
}
