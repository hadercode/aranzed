import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  SlidersHorizontal,
  Warehouse as WarehouseIcon,
  Calendar,
  FileCheck2,
  Tag,
} from "lucide-react";
import { TextInput, Select } from "@/shared/components/ui";
import type {
  InventoryTransactionType,
  InventoryTransactionStatus,
} from "../../types";
import type { UseTransactionFormReturn } from "../../hooks/useTransactionForm";

interface TransactionHeaderSectionProps {
  formContext: UseTransactionFormReturn;
}

export function TransactionHeaderSection({
  formContext,
}: TransactionHeaderSectionProps) {
  const {
    txType,
    setTxType,
    movementDate,
    setMovementDate,
    originWarehouseId,
    setOriginWarehouseId,
    destWarehouseId,
    setDestWarehouseId,
    reasonId,
    setReasonId,
    status,
    setStatus,
    warehouses,
    filteredReasons,
    isEditMode,
  } = formContext;

  const movementTypes: Array<{
    type: InventoryTransactionType;
    label: string;
    description: string;
    icon: typeof ArrowDownCircle;
    color: string;
  }> = [
    {
      type: "RECEPTION",
      label: "Recepción (+)",
      description: "Ingreso de mercancía por compras o saldos",
      icon: ArrowDownCircle,
      color: "emerald",
    },
    {
      type: "ISSUE",
      label: "Salida (-)",
      description: "Consumo interno, mermas o bajas",
      icon: ArrowUpCircle,
      color: "rose",
    },
    {
      type: "TRANSFER",
      label: "Transferencia",
      description: "Reubicación entre almacenes",
      icon: ArrowLeftRight,
      color: "blue",
    },
    {
      type: "ADJUSTMENT",
      label: "Ajuste (+/-)",
      description: "Auditoría y conciliación física",
      icon: SlidersHorizontal,
      color: "amber",
    },
  ];

  return (
    <div className="bg-[var(--color-surface-card)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm space-y-6">
      {/* Selector visual de Tipo de Movimiento */}
      <div>
        <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
          1. Tipo de Movimiento
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {movementTypes.map((m) => {
            const Icon = m.icon;
            const isSelected = txType === m.type;
            return (
              <button
                key={m.type}
                type="button"
                disabled={isEditMode}
                onClick={() => setTxType(m.type)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? "border-[var(--color-sage-600)] bg-[var(--color-sage-50)] dark:bg-[var(--color-surface-hover)] shadow-xs ring-2 ring-[var(--color-sage-500)]/20"
                    : "border-[var(--color-border)] bg-[var(--color-surface-bg)] hover:border-[var(--color-text-muted)]"
                } ${isEditMode ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-[var(--color-sage-600)] text-white"
                        : "bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                    {m.label}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {m.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Configuración de Cabecera */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[var(--color-border)]">
        {/* Fecha */}
        <TextInput
          type="date"
          label="Fecha de Operación"
          required
          leftIcon={<Calendar size={18} />}
          value={movementDate}
          onChange={(e) => setMovementDate(e.target.value)}
        />

        {/* Almacén Origen */}
        {(txType === "ISSUE" ||
          txType === "TRANSFER" ||
          txType === "ADJUSTMENT") && (
          <Select
            label="Almacén Origen"
            required={txType === "ISSUE" || txType === "TRANSFER"}
            leftIcon={<WarehouseIcon size={18} />}
            value={originWarehouseId}
            disabled={isEditMode}
            onChange={(e) => setOriginWarehouseId(e.target.value)}
            options={[
              { value: "", label: "Seleccione almacén origen..." },
              ...warehouses.map((w) => ({
                value: w.id,
                label: `${w.code} - ${w.name}`,
              })),
            ]}
          />
        )}

        {/* Almacén Destino */}
        {(txType === "RECEPTION" ||
          txType === "TRANSFER" ||
          txType === "ADJUSTMENT") && (
          <Select
            label="Almacén Destino"
            required={txType === "RECEPTION" || txType === "TRANSFER"}
            leftIcon={<WarehouseIcon size={18} />}
            value={destWarehouseId}
            disabled={isEditMode}
            onChange={(e) => setDestWarehouseId(e.target.value)}
            options={[
              { value: "", label: "Seleccione almacén destino..." },
              ...warehouses.map((w) => ({
                value: w.id,
                label: `${w.code} - ${w.name}`,
              })),
            ]}
          />
        )}

        {/* Motivo de Inventario */}
        <Select
          label="Motivo / Tipificación"
          leftIcon={<Tag size={18} />}
          value={reasonId}
          disabled={isEditMode}
          onChange={(e) => setReasonId(e.target.value)}
          options={[
            { value: "", label: "Seleccione motivo..." },
            ...filteredReasons.map((r) => ({
              value: r.id,
              label: `${r.name} (${r.type})`,
            })),
          ]}
        />

        {/* Estado Operativo */}
        <Select
          label="Estado del Registro"
          leftIcon={<FileCheck2 size={18} />}
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as InventoryTransactionStatus)
          }
          options={[
            {
              value: "COMPLETED",
              label: "Completada (Afectar Stock Físico Inmediatamente)",
            },
            {
              value: "DRAFT",
              label: "Borrador (Sin impacto en stock)",
            },
          ]}
        />
      </div>
    </div>
  );
}
