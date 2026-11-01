import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button } from '@/shared/components/ui';
import type { Warehouse, CreateWarehouseDto } from '../types';
import { warehouseSchema, type WarehouseFormData } from '../schemas/warehouse.schema';

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      code: '',
      name: '',
      location: '',
      isActive: true,
      isSalesWarehouse: false,
    },
  });

  useEffect(() => {
    if (warehouse) {
      reset({
        code: warehouse.code,
        name: warehouse.name,
        location: warehouse.location || '',
        isActive: Boolean(warehouse.isActive),
        isSalesWarehouse: Boolean(warehouse.isSalesWarehouse),
      });
    } else {
      reset({
        code: '',
        name: '',
        location: '',
        isActive: true,
        isSalesWarehouse: false,
      });
    }
  }, [warehouse, isOpen, reset]);

  const onFormSubmit = async (data: WarehouseFormData) => {
    await onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={warehouse ? 'Editar Almacén' : 'Nuevo Almacén'}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Código *
          </label>
          <input
            type="text"
            {...register('code')}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)] uppercase"
            placeholder="ALM-01"
          />
          {errors.code && (
            <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Nombre del Almacén *
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
            placeholder="Almacén Principal"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            Ubicación / Dirección
          </label>
          <input
            type="text"
            {...register('location')}
            className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-sage-500)]"
            placeholder="Sede Central - Piso 1"
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--color-text-primary)]">
            <input
              type="checkbox"
              {...register('isActive')}
              className="rounded text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)]"
            />
            <span>Almacén Activo</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--color-text-primary)]">
            <input
              type="checkbox"
              {...register('isSalesWarehouse')}
              className="rounded text-[var(--color-sage-600)] focus:ring-[var(--color-sage-500)]"
            />
            <span>Disponible para Ventas</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {warehouse ? 'Actualizar' : 'Crear Almacén'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default WarehouseFormModal;
