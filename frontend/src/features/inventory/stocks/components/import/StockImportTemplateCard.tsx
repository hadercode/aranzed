import { Download, FileSpreadsheet, HelpCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui';

interface StockImportTemplateCardProps {
  onDownloadTemplate: () => Promise<void>;
  isDownloadingTemplate: boolean;
}

export function StockImportTemplateCard({
  onDownloadTemplate,
  isDownloadingTemplate,
}: StockImportTemplateCardProps) {
  return (
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
          que manejan inventario. Solo deberás completar el almacén, la cantidad inicial y el costo.
        </p>

        <div className="p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] space-y-2 text-xs text-[var(--color-text-secondary)]">
          <div className="font-semibold text-[var(--color-text-primary)] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            Reglas para la carga inicial:
          </div>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <span className="font-semibold text-[var(--color-text-primary)]">Solo artículos existentes:</span>{' '}
              No se pueden registrar existencias de artículos no registrados en el catálogo.
            </li>
            <li>
              <span className="font-semibold text-[var(--color-text-primary)]">Filas sin existencias:</span>{' '}
              Si no tienes saldo, déjalo con cantidad vacía o 0; se omitirá sin error.
            </li>
            <li>
              <span className="font-semibold text-[var(--color-text-primary)]">Almacenes:</span>{' '}
              La hoja 2 incluye todos los almacenes registrados en el sistema.
            </li>
          </ul>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={() => void onDownloadTemplate()}
        loading={isDownloadingTemplate}
        leftIcon={<Download className="w-4 h-4" />}
        className="w-full mt-2"
      >
        Descargar Plantilla Pre-cargada (.xlsx)
      </Button>
    </div>
  );
}

