import { Trash2 } from "lucide-react";
import { StaticTable, TextInput, Select } from "@/shared/components/ui";
import type { UseTransactionFormReturn } from "../../hooks/useTransactionForm";

export interface TransactionItemsTableProps {
  formContext: UseTransactionFormReturn;
}

export function TransactionItemsTable({
  formContext,
}: TransactionItemsTableProps) {
  const {
    items,
    removeItem,
    updateItem,
    selectProduct,
    products,
    txType,
    isEditMode,
    functionalSymbol,
  } = formContext;

  const isCostEditable = txType === "RECEPTION";

  return (
    <StaticTable>
      <StaticTable.Head>
        <StaticTable.Row>
          <StaticTable.Th minWidth={280}>Producto *</StaticTable.Th>
          <StaticTable.Th align="right" minWidth={120}>
            Cantidad *
          </StaticTable.Th>
          <StaticTable.Th align="right" minWidth={120}>
            Costo Unit. ({functionalSymbol})
          </StaticTable.Th>
          <StaticTable.Th align="right" minWidth={120}>
            Subtotal
          </StaticTable.Th>
          <StaticTable.Th minWidth={140}>Lote / Control</StaticTable.Th>
          <StaticTable.Th minWidth={130}>Vencimiento</StaticTable.Th>
          <StaticTable.Th minWidth={180}>Observación</StaticTable.Th>
          {!isEditMode && (
            <StaticTable.Th align="center" width={40}></StaticTable.Th>
          )}
        </StaticTable.Row>
      </StaticTable.Head>
      <StaticTable.Body>
        {items.map((row, idx) => {
          const subtotal = Number(row.quantity || 0) * Number(row.cost || 0);

          return (
            <StaticTable.Row key={idx}>
              {/* Producto */}
              <StaticTable.Td>
                {isEditMode ? (
                  <div>
                    <span className="font-medium text-[var(--color-text-primary)] block">
                      {row.nameSnapshot}
                    </span>
                    <span className="font-mono text-xs text-[var(--color-text-muted)]">
                      SKU: {row.skuSnapshot}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Select
                      sizeVariant="sm"
                      required
                      value={row.productId}
                      onChange={(e) => selectProduct(idx, e.target.value)}
                      options={[
                        { value: "", label: "Seleccione Producto..." },
                        ...products.map((p) => ({
                          value: p.id,
                          label: `${p.name}${p.sku ? ` (${p.sku})` : ""}`,
                        })),
                      ]}
                    />
                    {row.skuSnapshot && (
                      <span className="font-mono text-[11px] text-[var(--color-text-muted)] block pl-1">
                        SKU: {row.skuSnapshot}
                      </span>
                    )}
                  </div>
                )}
              </StaticTable.Td>

              {/* Cantidad */}
              <StaticTable.Td>
                <div className="flex items-center gap-1.5 justify-end">
                  <TextInput
                    sizeVariant="sm"
                    type="number"
                    required
                    min="0.0001"
                    step="any"
                    disabled={isEditMode}
                    value={row.quantity}
                    onChange={(e) =>
                      updateItem(idx, {
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-24 text-right font-medium"
                    containerClassName="w-auto"
                  />
                  <span className="text-xs font-mono text-[var(--color-text-secondary)] font-semibold w-8">
                    {row.uomSymbol}
                  </span>
                </div>
              </StaticTable.Td>

              {/* Costo Unitario */}
              <StaticTable.Td align="right">
                {isCostEditable && !isEditMode ? (
                  <div className="flex items-center justify-end">
                    <TextInput
                      sizeVariant="sm"
                      type="number"
                      min="0"
                      step="any"
                      value={row.cost}
                      onChange={(e) =>
                        updateItem(idx, {
                          cost: parseFloat(e.target.value) || 0,
                        })
                      }
                      leftIcon={
                        <span className="text-gray-400 font-semibold text-[11px]">
                          {functionalSymbol}
                        </span>
                      }
                      className="w-24 text-right font-mono"
                      containerClassName="w-auto"
                    />
                  </div>
                ) : (
                  <span className="font-mono text-xs text-[var(--color-text-secondary)]">
                    {row.cost
                      ? `${functionalSymbol} ${Number(row.cost).toFixed(2)}`
                      : "PEPS (Automático)"}
                  </span>
                )}
              </StaticTable.Td>

              {/* Subtotal */}
              <StaticTable.Td
                align="right"
                className="font-mono text-xs font-semibold text-[var(--color-text-primary)]"
              >
                {row.cost && subtotal > 0
                  ? `${functionalSymbol} ${subtotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : "-"}
              </StaticTable.Td>

              {/* Lote */}
              <StaticTable.Td>
                <TextInput
                  sizeVariant="sm"
                  type="text"
                  disabled={isEditMode}
                  value={row.batchNumber || ""}
                  onChange={(e) =>
                    updateItem(idx, { batchNumber: e.target.value })
                  }
                  placeholder="Ej: LOTE-2026A"
                  className="font-mono text-xs"
                />
              </StaticTable.Td>

              {/* Vencimiento */}
              <StaticTable.Td>
                <TextInput
                  sizeVariant="sm"
                  type="date"
                  disabled={isEditMode}
                  value={row.expiryDate || ""}
                  onChange={(e) =>
                    updateItem(idx, { expiryDate: e.target.value })
                  }
                  className="text-xs"
                />
              </StaticTable.Td>

              {/* Comentario por renglón */}
              <StaticTable.Td>
                <TextInput
                  sizeVariant="sm"
                  type="text"
                  disabled={isEditMode}
                  value={row.customComment || ""}
                  onChange={(e) =>
                    updateItem(idx, { customComment: e.target.value })
                  }
                  placeholder="Nota específica..."
                  className="text-xs"
                />
              </StaticTable.Td>

              {/* Eliminar renglón */}
              {!isEditMode && (
                <StaticTable.Td align="center">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={items.length <= 1}
                    className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    title="Eliminar ítem"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </StaticTable.Td>
              )}
            </StaticTable.Row>
          );
        })}
      </StaticTable.Body>
    </StaticTable>
  );
}

export default TransactionItemsTable;
