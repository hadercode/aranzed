import { useState, useEffect } from 'react';
import { Modal, Button } from '@/shared/components/ui';
import type { Warehouse, CreateWarehouseDto } from '../types';

interface WarehouseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse | null;
  onSubmit: (data: CreateWarehouseDto) => Promise<void>;
  loading?: boolean;
}

export function WarehouseFormModal({
  isOpen,
  onClose,
  warehouse,
  onSubmit,
  loading = false,
}: WarehouseFormModalProps) {
  const [formData, setFormData] = useState<CreateWarehouseDto>({
    code: '',
    name: '',
    location: '',
    isActive: true,
    isSalesWarehouse: false,
  });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        code: warehouse.code,
        name: warehouse.name,
        location: warehouse.location || '',
        isActive: warehouse.isActive,
        isSalesWarehouse: warehouse.isSalesWarehouse,
      });
    } else {
      setFormData({
        code: '',
        name: '',
        location: '',
        isActive: true,
        isSalesWarehouse: false,
      });
    }
  }, [warehouse, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) return;
    await onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={warehouse ? 'Editar Almacén' : 'Nuevo Almacén'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Código *
          </label>
          <input
            type="text"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="Ej: ALM-01"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Nombre del Almacén *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Depósito Central"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Ubicación / Dirección
          </label>
          <textarea
            rows={2}
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Dirección o referencia del depósito..."
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] resize-none"
          />
        </div>

        <div className="pt-2 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--color-text-primary)]">
            <input
              type="checkbox"
              checked={formData.isSalesWarehouse}
              onChange={(e) => setFormData({ ...formData, isSalesWarehouse: e.target.checked })}
              className="rounded border-[var(--color-border)] text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)]"
            />
            <span className="font-medium">Almacén Predeterminado para Ventas (POS)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--color-text-primary)]">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-[var(--color-border)] text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)]"
            />
            <span>Almacén Activo y Operativo</span>
          </label>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)]">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {warehouse ? 'Guardar Cambios' : 'Crear Almacén'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
