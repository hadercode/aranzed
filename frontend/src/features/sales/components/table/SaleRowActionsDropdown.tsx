import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  Printer,
  Edit,
  CheckCircle,
  ArrowRightCircle,
  Ban,
  Trash2,
  DollarSign,
  Receipt,
  CheckSquare,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import type { Sale } from "../../types";
import { WhatsAppIcon } from "../payments/modal/SaleWhatsAppReminderModal";
import { checkIsSaleOverdue } from "../../utils/saleWhatsAppUtils";

export interface SaleRowActionsDropdownProps {
  sale: Sale;
  onPreview: (sale: Sale) => void;
  onPrint: (sale: Sale) => void;
  onWhatsAppReminder: (sale: Sale) => void;
  onEdit: (id: string) => void;
  onConfirm: (sale: Sale) => void;
  onConvert: (sale: Sale) => void;
  onCancel: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
  onOpenQuickPayment?: (sale: Sale) => void;
  onOpenCloseManual?: (sale: Sale) => void;
  onOpenPaymentsHistory?: (sale: Sale) => void;
}

interface DropdownCoords {
  top?: number;
  bottom?: number;
  right: number;
  openUp: boolean;
}

export function SaleRowActionsDropdown({
  sale,
  onPreview,
  onPrint,
  onWhatsAppReminder,
  onEdit,
  onConfirm,
  onConvert,
  onCancel,
  onDelete,
  onOpenQuickPayment,
  onOpenCloseManual,
  onOpenPaymentsHistory,
}: SaleRowActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<DropdownCoords | null>(null);
  const [isOverdue, setIsOverdue] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isQuotation = sale.saleType === "QUOTATION";
  const isCompleted = sale.status === "COMPLETED";
  const isCancelled = sale.status === "CANCELLED";
  const hasPendingBalance =
    !isQuotation &&
    !isCancelled &&
    (sale.paidStatus !== "PAGADO" ||
      (sale.balance !== undefined && sale.balance > 0));

  // Calcular posición del menú anclado al trigger
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const estimatedHeight = 360;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    if (openUp) {
      setCoords({
        bottom: window.innerHeight - rect.top + 6,
        right: window.innerWidth - rect.right,
        openUp: true,
      });
    } else {
      setCoords({
        top: rect.bottom + 6,
        right: window.innerWidth - rect.right,
        openUp: false,
      });
    }
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      setIsOverdue(checkIsSaleOverdue(sale, hasPendingBalance));
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Cerrar al hacer clic fuera, scroll o presionar Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = (e: Event) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const executeAction = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative inline-block text-right">
      {/* Botón trigger principal de Acciones */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all select-none ${
          isOpen
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40 ring-2 ring-emerald-500/20"
            : "bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-[var(--color-border)] shadow-2xs hover:shadow-xs"
        }`}
        title="Opciones y acciones del documento"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span>Acciones</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-60 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menú Dropdown renderizado mediante Portal en body (cero clipping por overflow) */}
      {isOpen &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.openUp ? undefined : `${coords.top}px`,
              bottom: coords.openUp ? `${coords.bottom}px` : undefined,
              right: `${coords.right}px`,
              zIndex: 9999,
            }}
            className="w-64 max-h-[85vh] overflow-y-auto bg-[var(--color-surface-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] py-1.5 text-xs text-[var(--color-text-primary)] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header informativo del menú */}
            <div className="px-3.5 py-2 border-b border-[var(--color-border)] bg-[var(--color-surface-bg)]/60">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)] font-mono text-[11px]">
                  {sale.saleNumber}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isQuotation
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {isQuotation ? "Cotización" : "Venta"}
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-muted)] truncate mt-0.5">
                {sale.customerName}
              </p>
            </div>

            {/* Grupo 1: Visualización e Impresión */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => executeAction(() => onPreview(sale))}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Ver Comprobante / Detalle</span>
              </button>

              <button
                type="button"
                onClick={() => executeAction(() => onPrint(sale))}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <Printer className="w-4 h-4 text-purple-500 shrink-0" />
                <span>Imprimir PDF</span>
              </button>
            </div>

            {/* Separador */}
            <div className="border-t border-[var(--color-border)] my-1" />

            {/* Grupo 2: Cobranza & Gestión Financiera */}
            <div className="py-1">
              {/* Notificación de Cobro por WhatsApp */}
              {hasPendingBalance && (
                <button
                  type="button"
                  onClick={() => executeAction(() => onWhatsAppReminder(sale))}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <WhatsAppIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Notificar Cobro (WhatsApp)</span>
                  </div>
                  {isOverdue && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400">
                      Vencida
                    </span>
                  )}
                </button>
              )}

              {/* Registrar Cobro / Abono Directo */}
              {!isQuotation &&
                isCompleted &&
                sale.paidStatus !== "PAGADO" &&
                onOpenQuickPayment && (
                  <button
                    type="button"
                    onClick={() =>
                      executeAction(() => onOpenQuickPayment(sale))
                    }
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Registrar Cobro / Abono</span>
                  </button>
                )}

              {/* Historial de Pagos */}
              {!isQuotation &&
                (sale.paidAmount > 0 || sale.paidStatus !== "PENDIENTE") &&
                onOpenPaymentsHistory && (
                  <button
                    type="button"
                    onClick={() =>
                      executeAction(() => onOpenPaymentsHistory(sale))
                    }
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    <Receipt className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Historial de Cobros</span>
                  </button>
                )}

              {/* Cerrar Venta Manualmente con Diferencia */}
              {!isQuotation &&
                isCompleted &&
                sale.paidStatus === "ABONADO" &&
                onOpenCloseManual && (
                  <button
                    type="button"
                    onClick={() =>
                      executeAction(() => onOpenCloseManual(sale))
                    }
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-amber-600 dark:text-amber-400 font-medium"
                  >
                    <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Cerrar con Diferencia Mínima</span>
                  </button>
                )}

              {/* Convertir cotización a venta directa */}
              {isQuotation && !isCancelled && (
                <button
                  type="button"
                  onClick={() => executeAction(() => onConvert(sale))}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  <ArrowRightCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Convertir a Venta Directa</span>
                </button>
              )}

              {/* Confirmar venta pendiente/borrador -> COMPLETED */}
              {!isQuotation && !isCompleted && !isCancelled && (
                <button
                  type="button"
                  onClick={() => executeAction(() => onConfirm(sale))}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-emerald-600 dark:text-emerald-400 font-medium"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Confirmar y Completar Venta</span>
                </button>
              )}
            </div>

            {/* Separador */}
            <div className="border-t border-[var(--color-border)] my-1" />

            {/* Grupo 3: Edición y Acciones Administrativas */}
            <div className="py-1">
              {/* Editar */}
              {!isCompleted && !isCancelled && (
                <button
                  type="button"
                  onClick={() => executeAction(() => onEdit(sale.id))}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer text-[var(--color-text-secondary)] hover:text-amber-600"
                >
                  <Edit className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Editar Documento</span>
                </button>
              )}

              {/* Anular */}
              {!isCancelled && (
                <button
                  type="button"
                  onClick={() => executeAction(() => onCancel(sale))}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                >
                  <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Anular Documento</span>
                </button>
              )}

              {/* Eliminar (solo borrador o anulada) */}
              {(sale.status === "DRAFT" || isCancelled) && (
                <button
                  type="button"
                  onClick={() => executeAction(() => onDelete(sale))}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-left hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 transition-colors cursor-pointer font-medium"
                >
                  <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Eliminar Registro</span>
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default SaleRowActionsDropdown;
