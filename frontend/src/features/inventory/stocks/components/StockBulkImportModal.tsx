import React, { useRef, useState } from 'react';
import {
  Download,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Check,
  Package,
  Layers,
  HelpCircle,
  Warehouse,
} from 'lucide-react';
import { Modal, Button } from '@/shared/components/ui';
import { useStockBulkImport } from '../hooks/useStockBulkImport';
import type { StockImportRowStatus, BulkStockImportItemValidation } from '../types';

export interface StockBulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

const statusBadgeStyles: Record<
  StockImportRowStatus,
  { bg: string; label: string; icon: any }
> = {
  VALID: {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
    label: 'Listo para Ingresar',
    icon: CheckCircle2,
  },
  DUPLICATE: {
    bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
    label: 'Duplicado',
    icon: AlertTriangle,
  },
  INVALID: {
    bg: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
    label: 'Con Errores',
    icon: XCircle,
  },
  SKIPPED: {
    bg: 'bg-slate-500/10 border-slate-500/20 text-slate-500 dark:text-slate-400',
    label: 'Omitido (Cant. 0)',
    icon: Package,
  },
};

export function StockBulkImportModal({
  isOpen,
  onClose,
  onImportSuccess,
}: StockBulkImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

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
    filterTab,
    setFilterTab,
    filteredRows,
    handleDownloadTemplate,
    handleFileSelect,
    handleExecuteImport,
    handleReset,
  } = useStockBulkImport({
    onImportCompleted: onImportSuccess,
  });

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      void handleFileSelect(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      void handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Carga Masiva de Existencias y Saldos Iniciales"
      size="full"
    >
      <div className="space-y-6">
        {/* Indicador de Pasos */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'upload'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500/20 text-emerald-600'
              }`}
            >
              1
            </div>
            <span
              className={`text-sm font-medium ${
                step === 'upload'
                  ? 'text-[var(--color-text-primary)] font-semibold'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              Plantilla y Archivo
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'preview'
                  ? 'bg-emerald-600 text-white'
                  : step === 'success'
                  ? 'bg-emerald-500/20 text-emerald-600'
                  : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
              }`}
            >
              2
            </div>
            <span
              className={`text-sm font-medium ${
                step === 'preview'
                  ? 'text-[var(--color-text-primary)] font-semibold'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              Validación y Vista Previa
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
              }`}
            >
              3
            </div>
            <span
              className={`text-sm font-medium ${
                step === 'success'
                  ? 'text-[var(--color-text-primary)] font-semibold'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              Ingreso al Inventario
            </span>
          </div>
        </div>

        {/* Banner de Error si ocurre */}
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

        {/* ========================================================================= */}
        {/* PASO 1: Descargar Plantilla Pre-cargada y Subida                           */}
        {/* ========================================================================= */}
        {step === 'upload' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opción 1: Descargar Plantilla con Artículos Pre-cargados */}
            <div className="p-6 rounded-3xl bg-[var(--color-surface-hover)]/40 border border-[var(--color-border)] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  1. Descarga la Plantilla Pre-cargada
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  El sistema genera un archivo Excel que ya contiene{' '}
                  <span className="font-semibold text-emerald-600">
                    todos los artículos registrados en tu catálogo
                  </span>{' '}
                  que manejan inventario. Solo deberás completar el almacén, la cantidad inicial
                  y el costo.
                </p>

                <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] space-y-2 text-xs text-[var(--color-text-secondary)]">
                  <div className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-500" />
                    Reglas para la carga inicial:
                  </div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        Solo artículos existentes:
                      </span>{' '}
                      No se pueden registrar existencias de artículos no registrados previamente en el catálogo.
                    </li>
                    <li>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        Filas sin existencias:
                      </span>{' '}
                      Si no tienes saldo para un artículo, déjalo con cantidad vacía o en 0; el sistema lo omitirá sin errores.
                    </li>
                    <li>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        Almacenes:
                      </span>{' '}
                      La hoja 2 incluye todos los almacenes registrados en el sistema.
                    </li>
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
                Descargar Plantilla Pre-cargada (.xlsx)
              </Button>
            </div>

            {/* Opción 2: Subir Archivo */}
            <div className="p-6 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  2. Sube el Archivo Completado
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  Arrastra o selecciona el archivo Excel con las cantidades iniciales. El sistema
                  validará contra el catálogo y almacenes antes de generar las capas de inventario y el Kárdex.
                </p>

                {/* Dropzone interactiva */}
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
        )}

        {/* ========================================================================= */}
        {/* PASO 2: Validación y Vista Previa Detallada                                */}
        {/* ========================================================================= */}
        {step === 'preview' && validationResult && (
          <div className="space-y-5">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--color-surface-hover)]/40 border border-[var(--color-border)]">
                <span className="text-xs text-[var(--color-text-secondary)] font-medium">
                  Total Filas Leídas
                </span>
                <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
                  {validationResult.totalRows}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Listos para Ingresar
                </span>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                  {validationResult.validCount}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Omitidos (Cant. 0)
                </span>
                <p className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-1">
                  {validationResult.skippedCount}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  Con Errores / Duplicados
                </span>
                <p className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">
                  {validationResult.invalidCount + validationResult.duplicateCount}
                </p>
              </div>
            </div>

            {/* Alerta explicativa */}
            {(validationResult.duplicateCount > 0 || validationResult.invalidCount > 0) && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-xs leading-relaxed">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <span className="font-bold">Protección de consistencia:</span>{' '}
                  Los registros con errores (artículos o almacenes inexistentes) serán omitidos.
                  Solo se procesarán los{' '}
                  <span className="font-semibold underline">
                    {validationResult.validCount} artículos válidos
                  </span>{' '}
                  para generar los saldos de inventario correctos.
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 p-1 bg-[var(--color-surface-hover)] rounded-2xl border border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterTab === 'all'
                      ? 'bg-[var(--color-surface-card)] text-[var(--color-text-primary)] shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Todos ({validationResult.totalRows})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('valid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterTab === 'valid'
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-emerald-600'
                  }`}
                >
                  Listos ({validationResult.validCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('skipped')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterTab === 'skipped'
                      ? 'bg-slate-500/20 text-slate-700 dark:text-slate-300 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-slate-600'
                  }`}
                >
                  Omitidos ({validationResult.skippedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('errors')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    filterTab === 'errors'
                      ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300 shadow-sm'
                      : 'text-[var(--color-text-secondary)] hover:text-rose-600'
                  }`}
                >
                  Con Errores ({validationResult.invalidCount + validationResult.duplicateCount})
                </button>
              </div>

              <div className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                <span>Archivo:</span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {file?.name}
                </span>
              </div>
            </div>

            {/* Tabla de Registros */}
            <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden max-h-[420px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] z-10">
                  <tr className="text-[var(--color-text-secondary)] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3 w-14">Fila</th>
                    <th className="py-2.5 px-3 w-36">Estado</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Artículo</th>
                    <th className="py-2.5 px-3 w-28">Almacén Destino</th>
                    <th className="py-2.5 px-3 w-20 text-right">Cantidad</th>
                    <th className="py-2.5 px-3 w-20 text-right">Costo Unit.</th>
                    <th className="py-2.5 px-3 w-24 text-right">Costo Total</th>
                    <th className="py-2.5 px-3 min-w-[200px]">Validación / Alerta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface-card)]">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[var(--color-text-muted)]">
                        No hay registros que coincidan con la pestaña seleccionada.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row: BulkStockImportItemValidation) => {
                      const badge = statusBadgeStyles[row.status];
                      const IconComponent = badge.icon;

                      return (
                        <tr
                          key={row.rowNumber}
                          className="hover:bg-[var(--color-surface-hover)]/40 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-mono text-[var(--color-text-muted)]">
                            #{row.rowNumber}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold ${badge.bg}`}
                            >
                              <IconComponent className="w-3.5 h-3.5 shrink-0" />
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-[var(--color-text-primary)]">
                              {row.productName}
                            </div>
                            <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-2">
                              <span>Unidad: {row.uomSymbol}</span>
                              {row.batchNumber && <span>Lote: {row.batchNumber}</span>}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1 text-[var(--color-text-primary)] font-medium">
                              <Warehouse className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                              <span>{row.warehouseName || '-'}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-[var(--color-text-primary)] font-mono">
                            {row.quantity > 0 ? row.quantity.toLocaleString() : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[var(--color-text-secondary)] font-mono">
                            ${row.unitCost.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-600 font-mono">
                            ${row.totalCost.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3">
                            {row.errors.length > 0 ? (
                              <div className="space-y-1">
                                {row.errors.map((err, i) => (
                                  <div
                                    key={i}
                                    className="text-rose-600 dark:text-rose-400 text-[11px] font-medium leading-tight flex items-start gap-1"
                                  >
                                    <span className="font-bold shrink-0">•</span>
                                    <span>{err}</span>
                                  </div>
                                ))}
                              </div>
                            ) : row.warnings && row.warnings.length > 0 ? (
                              <div className="space-y-1">
                                {row.warnings.map((warn, i) => (
                                  <div
                                    key={i}
                                    className="text-amber-600 dark:text-amber-400 text-[11px] leading-tight flex items-start gap-1"
                                  >
                                    <span className="font-bold shrink-0">•</span>
                                    <span>{warn}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-emerald-600 text-[11px] font-medium flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Artículo y almacén validados
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Barra de Acciones del Paso 2 */}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Subir Otro Archivo
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => void handleExecuteImport()}
                loading={isExecuting}
                disabled={validationResult.validCount === 0 || isExecuting}
                leftIcon={<Package className="w-4 h-4" />}
              >
                {validationResult.validCount === 0
                  ? 'No hay artículos con cantidad para cargar'
                  : `Ingresar ${validationResult.validCount} Artículo${
                      validationResult.validCount > 1 ? 's' : ''
                    } al Inventario`}
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PASO 3: Éxito y Resumen Final                                             */}
        {/* ========================================================================= */}
        {step === 'success' && importSummary && (
          <div className="py-8 px-4 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                ¡Saldos Iniciales Ingresados!
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Se han creado satisfactoriamente las capas de stock y los movimientos de Kárdex para{' '}
                <span className="font-bold text-emerald-600">
                  {importSummary.createdCount} artículos
                </span>{' '}
                en sus respectivos almacenes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center gap-6 text-xs text-[var(--color-text-secondary)]">
              <div>
                <span className="block font-medium">Procesados</span>
                <span className="font-bold text-base text-[var(--color-text-primary)]">
                  {importSummary.totalProcessed}
                </span>
              </div>
              <div className="w-px h-8 bg-[var(--color-border)]" />
              <div>
                <span className="block font-medium text-emerald-600">Ingresados con Éxito</span>
                <span className="font-bold text-base text-emerald-600">
                  {importSummary.createdCount}
                </span>
              </div>
              <div className="w-px h-8 bg-[var(--color-border)]" />
              <div>
                <span className="block font-medium">Fallos / Errores</span>
                <span className="font-bold text-base text-[var(--color-text-primary)]">
                  {importSummary.failedCount}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={handleClose}
              leftIcon={<Layers className="w-4 h-4" />}
              className="mt-4"
            >
              Finalizar y Ver Existencias
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

