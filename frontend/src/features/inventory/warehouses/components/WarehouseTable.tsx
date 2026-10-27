import { Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Warehouse } from '../types';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  isLoading: boolean;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (id: string) => void;
}

export function WarehouseTable({
  warehouses,
  isLoading,
  onEdit,
  onDelete,
}: WarehouseTableProps) {
  return (
    <div className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--color-surface-bg)] text-[var(--color-text-secondary)] font-medium border-b border-[var(--color-border)]">
          <tr>
            <th className="py-3.5 px-4">Código</th>
            <th className="py-3.5 px-4">Nombre</th>
            <th className="py-3.5 px-4">Ubicación</th>
            <th className="py-3.5 px-4 text-center">Almacén de Ventas (POS)</th>
            <th className="py-3.5 px-4 text-center">Estado</th>
            <th className="py-3.5 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[var(--color-text-muted)]">
                Cargando almacenes...
              </td>
            </tr>
          ) : warehouses.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[var(--color-text-muted)]">
                No se encontraron almacenes registrados.
              </td>
            </tr>
          ) : (
            warehouses.map((w) => (
              <tr key={w.id} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-[var(--color-sage-600)]">{w.code}</td>
                <td className="py-3.5 px-4 font-medium text-[var(--color-text-primary)]">{w.name}</td>
                <td className="py-3.5 px-4 text-[var(--color-text-secondary)]">{w.location || '-'}</td>
                <td className="py-3.5 px-4 text-center">
                  {w.isSalesWarehouse ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle className="w-3.5 h-3.5" /> Principal
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">-</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {w.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400">
                      <XCircle className="w-3.5 h-3.5" /> Inactivo
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(w)}
                      className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-bg)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(w.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
