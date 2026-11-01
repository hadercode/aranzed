import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { StockImportTemplateCard } from './StockImportTemplateCard';

interface StockImportUploadStepProps {
  onDownloadTemplate: () => Promise<void>;
  isDownloadingTemplate: boolean;
  onFileSelect: (file: File) => void;
  isValidating: boolean;
}

export function StockImportUploadStep({
  onDownloadTemplate,
  isDownloadingTemplate,
  onFileSelect,
  isValidating,
}: StockImportUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StockImportTemplateCard
        onDownloadTemplate={onDownloadTemplate}
        isDownloadingTemplate={isDownloadingTemplate}
      />

      <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            2. Sube el Archivo Completado
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Arrastra o selecciona el archivo Excel con las cantidades iniciales. El sistema validará contra el catálogo y almacenes antes de generar las capas de inventario y el Kárdex.
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-emerald-500 bg-emerald-500/5 scale-[1.01]'
                : 'border-[var(--color-border)] hover:border-emerald-500/60 bg-[var(--color-surface-hover)]/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={onFileInputChange}
              className="hidden"
            />

            {isValidating ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Validando existencias, catálogo y almacenes...
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Verificando consistencia de artículos existentes
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                  Haz clic aquí o arrastra tu archivo Excel
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Formatos soportados: .xlsx (Excel) hasta 10MB
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] pt-2">
          <span>Cálculo automático de Kárdex FIFO</span>
          <span>Validación previa 100% segura</span>
        </div>
      </div>
    </div>
  );
}

export default StockImportUploadStep;
