import React, { useRef, useState } from 'react';
import { Download, UploadCloud, FileSpreadsheet, HelpCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui';

export interface ProductImportUploadStepProps {
  isDownloadingTemplate: boolean;
  isValidating: boolean;
  handleDownloadTemplate: () => Promise<void>;
  handleFileSelect: (file: File) => Promise<void>;
}

export function ProductImportUploadStep({
  isDownloadingTemplate,
  isValidating,
  handleDownloadTemplate,
  handleFileSelect,
}: ProductImportUploadStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) void handleFileSelect(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) void handleFileSelect(droppedFile);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 rounded-3xl bg-[var(--color-surface-hover)]/40 border border-[var(--color-border)] flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            1. Descarga la Plantilla Oficial
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Obtén el archivo Excel oficial prediseñado con todas las columnas necesarias para tus
            artículos, ejemplos didácticos y una hoja auxiliar con los catálogos actualizados de
            Unidades de Medida y Categorías de tu empresa.
          </p>

          <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] space-y-2 text-xs text-[var(--color-text-secondary)]">
            <div className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              Recomendaciones clave:
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li>No cambies el nombre de las columnas en la fila 1.</li>
              <li>
                Usa códigos o nombres exactos de unidades (ej: <span className="font-mono">UND</span>,{' '}
                <span className="font-mono">KG</span>).
              </li>
              <li>Las filas que comiencen con [EJEMPLO] se omiten automáticamente.</li>
            </ul>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => void handleDownloadTemplate()}
          loading={isDownloadingTemplate}
          leftIcon={<Download className="w-4 h-4" />}
          className="w-full mt-2"
        >
          Descargar Plantilla (.xlsx)
        </Button>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            2. Sube tu Archivo Diligenciado
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Arrastra o selecciona el archivo Excel con tus artículos. El sistema validará cada fila
            para prevenir duplicados y datos inconsistentes antes de agregarlos al sistema.
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
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
                  Validando estructura y datos del catálogo...
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Verificando nombres únicos, unidades de medida y categorías
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
          <span>Poblado exclusivo del catálogo de artículos</span>
          <span>Validación previa 100% segura</span>
        </div>
      </div>
    </div>
  );
}

