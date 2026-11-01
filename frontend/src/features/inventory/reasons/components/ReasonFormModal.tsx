import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button } from '@/shared/components/ui';
import type { InventoryReason, CreateInventoryReasonDto } from '../types';
import { reasonSchema, type ReasonFormData } from '../schemas/reason.schema';

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReasonFormData>({
    resolver: zodResolver(reasonSchema),
    defaultValues: {
      name: '',
      type: 'OUTPUT',
      description: '',
    },
  });

  useEffect(() => {
    if (reason) {
      reset({
        name: reason.name,
        type: reason.type,
        description: reason.description || '',
      });
    } else {
      reset({
        name: '',
        type: 'OUTPUT',
        description: '',
      });
    }
  }, [reason, isOpen, reset]);

  const onFormSubmit = async (data: ReasonFormData) => {
    await onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reason ? 'Editar Motivo de Inventario' : 'Nuevo Motivo de Inventario'}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Nombre del Motivo *
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
            placeholder="Ej: Ajuste por Merma, Devolución de Cliente..."
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Tipo de Flujo *
          </label>
          <select
            {...register('type')}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
          >
            <option value="OUTPUT">SALIDA (Resta existencias)</option>
            <option value="INPUT">ENTRADA (Suma existencias)</option>
            <option value="BOTH">AMBOS (Entrada y Salida)</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Descripción / Observaciones
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
            placeholder="Detalles sobre cuándo debe utilizarse este motivo..."
          />
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {reason ? 'Actualizar Motivo' : 'Crear Motivo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ReasonFormModal;
