import React from 'react';
import { Zap, ShieldCheck, Layers } from 'lucide-react';
import { DualCurrencySummaryCards, type CurrencyBreakdownValues } from './DualCurrencySummaryCards';
import { useCurrencyStore } from '@/shared/hooks/store';

export interface DocumentInventoryConfig {
  /** Si se debe mostrar el banner de inventario (por defecto: true) */
  show?: boolean;
  /** Tipo de módulo para textos predefinidos ('purchase' | 'sale' | 'custom') */
  moduleType?: 'purchase' | 'sale' | 'custom';
  /** Título del bloque de integración */
  title?: string;
  /** Descripción del flujo de eventos con inventario */
  description?: React.ReactNode;
  /** Mensaje aclaratorio cuando el documento está completado */
  completedHint?: string;
  /** Mensaje aclaratorio cuando el documento está en borrador/pendiente */
  draftHint?: string;
  /** Estado actual del documento (ej. 'COMPLETED', 'DRAFT') */
  status?: string;
  /** Forzar explícitamente si se considera completado */
  isCompleted?: boolean;
}

export interface DocumentSummarySectionProps {
  /** Desglose consolidado en moneda funcional (USD) */
  functionalBreakdown: CurrencyBreakdownValues;
  /** Desglose consolidado en moneda local (VES) */
  localBreakdown: CurrencyBreakdownValues;
  /** Tasa de cambio de referencia */
  exchangeRate: number;
  /** Código de la moneda funcional (ej: 'USD') */
  functionalCurrency?: string;
  /** Símbolo de la moneda funcional (ej: '$') */
  functionalSymbol?: string;
  /** Código de la moneda local (ej: 'VES') */
  localCurrency?: string;
  /** Símbolo de la moneda local (ej: 'Bs.') */
  localSymbol?: string;
  /** Etiqueta descriptiva del impuesto fiscal (ej: 'IVA (16%)') */
  taxLabel?: string;
  /** Moneda física de emisión del documento */
  documentCurrency?: string;
  /** Cantidad total de renglones / items en la tabla */
  itemsCount?: number;
  /** Cantidad sumada de unidades físicas */
  totalUnits?: number;
  /** Configuración del banner de sincronización con inventario */
  inventory?: DocumentInventoryConfig;
  /** Contenido adicional o widgets contextuales (ej. Margen de rentabilidad en ventas) */
  children?: React.ReactNode;
  /** Clase CSS adicional para el contenedor principal */
  className?: string;
}

/**
 * Componente Global Compartido para la Liquidación y Resumen de Documentos Transaccionales (Compras, Ventas, etc.).
 *
 * Características:
 * - Tarjetas bimoneda reactivas (Moneda Funcional vs Moneda Local).
 * - Identificación visual de la moneda de origen de la factura.
 * - Banner informativo de arquitectura desacoplada para sincronización de stock con Inventario.
 * - Soporte de indicadores de renglones y unidades totales.
 * - Contenedor extensible mediante `children` para análisis de rentabilidad o notas comerciales.
 */
export function DocumentSummarySection({
  functionalBreakdown,
  localBreakdown,
  exchangeRate,
  functionalCurrency: propFunctionalCurrency,
  functionalSymbol: propFunctionalSymbol,
  localCurrency: propLocalCurrency,
  localSymbol: propLocalSymbol,
  taxLabel = 'IVA (16%)',
  documentCurrency,
  itemsCount = 0,
  totalUnits = 0,
  inventory = { show: true, moduleType: 'purchase' },
  children,
  className = '',
}: DocumentSummarySectionProps) {
  const {
    functionalCurrency: storeFunctional,
    functionalSymbol: storeFunctionalSymbol,
    localCurrency: storeLocal,
    localSymbol: storeLocalSymbol,
  } = useCurrencyStore();

  const activeFunctional = propFunctionalCurrency || storeFunctional;
  const activeFunctionalSymbol = propFunctionalSymbol || storeFunctionalSymbol;
  const activeLocal = propLocalCurrency || storeLocal;
  const activeLocalSymbol = propLocalSymbol || storeLocalSymbol;
  const activeDocCurrency = documentCurrency || activeFunctional;

  // Configuración de inventario
  const showInventory = inventory.show !== false;
  const moduleType = inventory.moduleType || 'purchase';
  const isCompleted =
    inventory.isCompleted !== undefined
      ? inventory.isCompleted
      : inventory.status === 'COMPLETED';

  const defaultDescription =
    moduleType === 'sale' ? (
      <>
        Este módulo opera de la siguiente manera: Al registrar o actualizar una venta con estado{' '}
        <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">COMPLETADA</strong>
        , automáticamente se descuentan los items vendidos del stock y se registra un movimiento de
        salida del inventario.
      </>
    ) : (
      <>
        Este módulo opera de la siguiente manera: Al registrar o actualizar una compra con estado{' '}
        <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">COMPLETADA</strong>
        , automáticamente se ingresan los items comprados al stock y se registra un movimiento de
        entrada al inventario.
      </>
    );

  const inventoryDescription = inventory.description ?? defaultDescription;

  const defaultCompletedHint =
    moduleType === 'sale'
      ? 'El evento se emitirá de inmediato al guardar esta venta.'
      : 'El evento se emitirá de inmediato al guardar esta compra.';

  const defaultDraftHint =
    'Estado en Borrador: el evento de inventario se emitirá únicamente cuando cambie a Completada.';

  const activeHint = isCompleted
    ? inventory.completedHint || defaultCompletedHint
    : inventory.draftHint || defaultDraftHint;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tarjetas globales de resumen financiero bimoneda */}
      <DualCurrencySummaryCards
        functionalBreakdown={functionalBreakdown}
        localBreakdown={localBreakdown}
        exchangeRate={exchangeRate}
        functionalCurrency={activeFunctional}
        functionalSymbol={activeFunctionalSymbol}
        localCurrency={activeLocal}
        localSymbol={activeLocalSymbol}
        taxLabel={taxLabel}
        documentCurrency={activeDocCurrency}
      />

      {/* Banner de arquitectura desacoplada por eventos para inventario */}
      {showInventory && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Zap className="w-5 h-5 text-emerald-500" />
              <h4 className="font-semibold text-sm">
                {inventory.title || 'Integración con Inventario'}
              </h4>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {inventoryDescription}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{activeHint}</span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t md:border-t-0 md:border-l border-emerald-500/15 pt-3 md:pt-0 md:pl-6 text-xs text-[var(--color-text-secondary)] gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>
                Total Renglones: <strong>{itemsCount}</strong>
              </span>
            </div>
            <div>
              <span>
                Unidades Totales:{' '}
                <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                  {totalUnits}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido adicional / slots específicos de módulo */}
      {children}
    </div>
  );
}

export default DocumentSummarySection;
