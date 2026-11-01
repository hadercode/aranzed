import { XCircle } from 'lucide-react';
import { Modal } from '@/shared/components/ui';
import { useStockBulkImport } from '../hooks/useStockBulkImport';
import { StockImportUploadStep } from './import/StockImportUploadStep';
import { StockImportPreviewStep } from './import/StockImportPreviewStep';
import { StockImportResultStep } from './import/StockImportResultStep';
import { StockImportStepWizard } from './import/StockImportStepWizard';

export interface StockBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export function StockBulkImportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: StockBulkImportModalProps) {
  const {
    step,
    file,
    isDownloadingTemplate,
    isValidating,
    isExecuting,
    validationResult,
    importSummary,
    error,
    clearError,
    handleDownloadTemplate,
    handleFileSelect,
    handleExecuteImport,
    handleReset,
  } = useStockBulkImport();

  const handleClose = () => {
    if (step === 'success') {
      onImportSuccess?.();
    }
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Carga Masiva de Saldos Iniciales de Inventario"
      size="xl"
    >
      <div className="space-y-6">
        <StockImportStepWizard step={step} />

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">Ocurrió un error:</span> {error}
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-rose-500 hover:text-rose-700 text-xs font-semibold cursor-pointer"
            >
              Descartar
            </button>
          </div>
        )}

        {step === 'upload' && (
          <StockImportUploadStep
            onDownloadTemplate={handleDownloadTemplate}
            isDownloadingTemplate={isDownloadingTemplate}
            onFileSelect={handleFileSelect}
            isValidating={isValidating}
          />
        )}

        {step === 'preview' && validationResult && (
          <StockImportPreviewStep
            validationResult={validationResult}
            fileName={file?.name}
            isExecuting={isExecuting}
            onReset={handleReset}
            onExecute={() => void handleExecuteImport()}
          />
        )}

        {step === 'success' && importSummary && (
          <StockImportResultStep
            summary={importSummary}
            onClose={handleClose}
          />
        )}
      </div>
    </Modal>
  );
}

export default StockBulkImportModal;
