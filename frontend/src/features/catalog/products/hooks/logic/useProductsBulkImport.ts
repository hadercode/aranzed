import { useState, useMemo, useCallback } from 'react';
import { productsImportService } from '../../services/products-import.service';
import type {
  BulkImportValidationResult,
  BulkImportSummary,
  BulkImportItemValidation,
} from '../../types';

export type ImportStep = 'upload' | 'preview' | 'success';
export type FilterTab = 'all' | 'valid' | 'errors';

export interface UseProductsBulkImportOptions {
  onImportCompleted?: () => void;
}

export function useProductsBulkImport(options: UseProductsBulkImportOptions = {}) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [validationResult, setValidationResult] = useState<BulkImportValidationResult | null>(null);
  const [importSummary, setImportSummary] = useState<BulkImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const clearError = useCallback(() => setError(null), []);

  const handleDownloadTemplate = useCallback(async () => {
    try {
      setIsDownloadingTemplate(true);
      setError(null);
      await productsImportService.downloadTemplate();
    } catch (err: any) {
      setError(err?.message || 'Error al descargar la plantilla');
    } finally {
      setIsDownloadingTemplate(false);
    }
  }, []);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      setIsValidating(true);
      setError(null);
      const result = await productsImportService.validateFile(selectedFile);
      setValidationResult(result);
      setStep('preview');
      setFilterTab('all');
    } catch (err: any) {
      setError(err?.message || 'Error al validar el archivo. Verifique el formato .xlsx');
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleExecuteImport = useCallback(async () => {
    if (!validationResult || validationResult.validCount === 0) return;

    try {
      setIsExecuting(true);
      setError(null);
      const validItems = validationResult.rows.filter((r) => r.status === 'VALID');
      const summary = await productsImportService.executeImport(validItems);
      setImportSummary(summary);
      setStep('success');
      options.onImportCompleted?.();
    } catch (err: any) {
      setError(err?.message || 'Error al procesar la importación de artículos');
    } finally {
      setIsExecuting(false);
    }
  }, [validationResult, options]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setFile(null);
    setValidationResult(null);
    setImportSummary(null);
    setError(null);
    setFilterTab('all');
  }, []);

  const filteredRows = useMemo<BulkImportItemValidation[]>(() => {
    if (!validationResult) return [];
    if (filterTab === 'valid') {
      return validationResult.rows.filter((r) => r.status === 'VALID');
    }
    if (filterTab === 'errors') {
      return validationResult.rows.filter(
        (r) => r.status === 'INVALID' || r.status === 'DUPLICATE',
      );
    }
    return validationResult.rows;
  }, [validationResult, filterTab]);

  return {
    step,
    file,
    isDownloadingTemplate,
    isValidating,
    isExecuting,
    validationResult,
    importSummary,
    error,
    clearError,
    filterTab,
    setFilterTab,
    filteredRows,
    handleDownloadTemplate,
    handleFileSelect,
    handleExecuteImport,
    handleReset,
  };
}

