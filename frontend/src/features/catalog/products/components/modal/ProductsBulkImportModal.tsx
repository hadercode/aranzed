import { XCircle } from 'lucide-react';
import { Modal } from '@/shared/components/ui';
import { useProductsBulkImport } from '../../hooks/logic/useProductsBulkImport';
import { ProductImportStepsHeader } from './bulk-import/ProductImportStepsHeader';
import { ProductImportUploadStep } from './bulk-import/ProductImportUploadStep';
import { ProductImportPreviewStep } from './bulk-import/ProductImportPreviewStep';
import { ProductImportResultStep } from './bulk-import/ProductImportResultStep';

export interface ProductsBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export function ProductsBulkImportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ProductsBulkImportModalProps) {
  const {
    step,
    file,
    isDownloadingTemplate,
    isValidating,
    isExecuting,
    validationResult,
    importSummary,
    error,
    filterTab,
    setFilterTab,
    filteredRows,
    handleDownloadTemplate,
    handleFileSelect,
    handleExecuteImport,
    handleReset,
  } = useProductsBulkImport({
    onImportCompleted: onImportSuccess,
  });

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Carga Masiva de Artículos al Catálogo"
      size="full"
    >
      <div className="space-y-6">
        <ProductImportStepsHeader step={step} />

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">Ocurrió un error:</span> {error}
              </div>
            </div>
          </div>
        )}

        {step === 'upload' && (
          <ProductImportUploadStep
            isDownloadingTemplate={isDownloadingTemplate}
            isValidating={isValidating}
            handleDownloadTemplate={handleDownloadTemplate}
            handleFileSelect={handleFileSelect}
          />
        )}

        {step === 'preview' && validationResult && (
          <ProductImportPreviewStep
            validationResult={validationResult}
            fileName={file?.name}
            filterTab={filterTab}
            setFilterTab={setFilterTab}
            filteredRows={filteredRows}
            isExecuting={isExecuting}
            handleReset={handleReset}
            handleExecuteImport={handleExecuteImport}
          />
        )}

        {step === 'success' && importSummary && (
          <ProductImportResultStep importSummary={importSummary} onFinish={handleClose} />
        )}
      </div>
    </Modal>
  );
}

export default ProductsBulkImportModal;
