import { Boxes, Plus, AlertCircle } from 'lucide-react';
import { useRecipeFormContext } from '../../../context';
import { SectionHeader } from '@/shared/components/ui';
import { RecipeItemsEmptyState, RecipeItemsTable } from './items';

export function RecipeItemsSection() {
  const { form, itemFields, handleAddNewItem } = useRecipeFormContext();
  const { formState: { errors } } = form;

  const itemsErrorMessage =
    errors.items && typeof errors.items.message === 'string'
      ? errors.items.message
      : null;

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-6">
      {/* Header & Add Component Action */}
      <SectionHeader
        icon={<Boxes className="w-4 h-4" />}
        iconColorClassName="bg-[var(--color-sage-50)] dark:bg-[var(--color-sage-500)]/10 text-[var(--color-sage-600)] dark:text-[var(--color-sage-400)]"
        title="Componentes, Materias Primas y Mano de Obra (Detalle)"
        description="Especifica los insumos y horas de mano de obra requeridos para fabricar el lote"
        action={{
          label: "Agregar Insumo / Servicio",
          onClick: () => handleAddNewItem(),
          icon: <Plus className="w-3.5 h-3.5" />,
          variant: "secondary",
          size: "sm",
        }}
      />

      {/* Validation Error Alert */}
      {itemsErrorMessage && (
        <div className="alert-danger p-3 rounded-xl text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{itemsErrorMessage}</span>
        </div>
      )}

      {/* Subcomponents: Empty State vs Items Table */}
      {itemFields.length === 0 ? (
        <RecipeItemsEmptyState />
      ) : (
        <RecipeItemsTable />
      )}
    </div>
  );
}

export default RecipeItemsSection;
