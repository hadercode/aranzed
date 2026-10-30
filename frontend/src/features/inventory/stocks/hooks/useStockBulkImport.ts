import { useState, useMemo, useCallback } from 'react';
import { stockImportService } from '../services/stock-import.service';
import type {
  BulkStockImportValidationResult,
  BulkStockImportSummary,
  BulkStockImportItemValidation,
} from '../types';

export type StockImportStep = 'upload' | 'preview' | 'success';
export type StockFilterTab = 'all' | 'valid' | 'errors' | 'skipped';

export interface UseStockBulkImportOptions {
  onImportCompleted?: () => void;
}

export function useStockBulkImport(options: UseStockBulkImportOptions = {}) {
  const [step, setStep] = useState<StockImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [validationResult, setValidationResult] =
    useState<BulkStockImportValidationResult | null>(null);
  const [importSummary, setImportSummary] = useState<BulkStockImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<StockFilterTab>('all');

  const clearError = useCallback(() => setError(null), []);

  const handleDownloadTemplate = useCallback(async () => {
    try {
      setIsDownloadingTemplate(true);
      setError(null);
      await stockImportService.downloadTemplate();
    } catch (err: any) {
      setError(err?.message || 'Error al descargar la plantilla de saldos iniciales');
    } finally {
      setIsDownloadingTemplate(false);
    }
  }, []);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    try {
      setFile(selectedFile);
      setIsValidating(true);
      setError(null);
      const result = await stockImportService.validateFile(selectedFile);
      setValidationResult(result);
      setStep('preview');
      setFilterTab('all');
    } catch (err: any) {
      setError(
        err?.message ||
          'Error al validar el archivo. Verifique que sea un Excel válido (.xlsx).',
      );
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
      const summary = await stockImportService.executeImport(validItems);
      setImportSummary(summary);
      setStep('success');
      options.onImportCompleted?.();
    } catch (err: any) {
      setError(
        err?.message ||
          'Error al procesar el ingreso de saldos iniciales en el inventario.',
      );
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

  const filteredRows = useMemo<BulkStockImportItemValidation[]>(() => {
    if (!validationResult) return [];
    if (filterTab === 'valid') {
      return validationResult.rows.filter((r) => r.status === 'VALID');
    }
    if (filterTab === 'errors') {
      return validationResult.rows.filter(
        (r) => r.status === 'INVALID' || r.status === 'DUPLICATE',
      );
    }
    if (filterTab === 'skipped') {
      return validationResult.rows.filter((r) => r.status === 'SKIPPED');
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

