import { useState, useEffect } from 'react';
import { Modal, Button } from '@/shared/components/ui';
import type { InventoryReason, InventoryReasonType, CreateInventoryReasonDto } from '../types';

interface ReasonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: InventoryReason | null;
  onSubmit: (data: CreateInventoryReasonDto) => Promise<void>;
  loading?: boolean;
}

export function ReasonFormModal({
  isOpen,
  onClose,
  reason,
  onSubmit,
  loading = false,
}: ReasonFormModalProps) {
  const [formData, setFormData] = useState<CreateInventoryReasonDto>({
    name: '',
    type: 'OUTPUT',
    description: '',
  });

  useEffect(() => {
    if (reason) {
      setFormData({
        name: reason.name,
        type: reason.type,
        description: reason.description || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'OUTPUT',
        description: '',
      });
    }
  }, [reason, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    await onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reason ? 'Editar Motivo de Inventario' : 'Nuevo Motivo de Inventario'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Nombre del Motivo *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Merma por Caducidad"
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Tipo de Movimiento Permitido *
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as InventoryReasonType })
            }
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          >
            <option value="OUTPUT">Salida (-) : Mermas, bajas, autoconsumo</option>
            <option value="INPUT">Entrada (+) : Ajuste inicial, donación, sobrante</option>
            <option value="BOTH">Ambos (+/-) : Ajuste físico cíclico o general</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Descripción / Observaciones
          </label>
          <textarea
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalles sobre cuándo debe utilizarse este motivo..."
            className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] resize-none"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-border)]">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {reason ? 'Guardar Cambios' : 'Crear Motivo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
