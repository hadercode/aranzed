import { useMemo } from 'react';
import type { UseRecipeFormPageReturn } from '../../../../hooks/logic/useRecipeFormPage';
import {
  RecipeItemTypeBadge,
  RecipeItemUomBadge,
  RecipeItemSubtotalCell,
} from './RecipeItemCells';
import {
  RecipeItemSelectCell,
  RecipeItemQuantityInput,
  RecipeItemCostInput,
  RecipeItemActionCell,
} from './RecipeItemInputCells';
import type { Column } from '@/shared/components/ui';

export function useRecipeItemsColumns(formPage: UseRecipeFormPageReturn) {
  const {
    form,
    itemFields,
    removeItem,
    handleComponentSelect,
    componentProductOptions,
    productsMap,
  } = formPage;

  const { register, control, formState: { errors } } = form;

  const columns: Column<(typeof itemFields)[number]>[] = useMemo(
    () => [
      {
        key: 'index',
        title: '#',
        align: 'center',
        className: 'w-10 text-xs font-mono',
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return <span className="text-[var(--color-text-muted)] font-mono text-xs">{index + 1}</span>;
        },
      },
      {
        key: 'product',
        title: 'Componente / Servicio',
        className: 'min-w-[220px]',
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <RecipeItemSelectCell
              registration={register(`items.${index}.productId` as const)}
              onChange={(val) => handleComponentSelect(index, val)}
              options={componentProductOptions}
              error={errors.items?.[index]?.productId}
            />
          );
        },
      },
      {
        key: 'type',
        title: 'Tipo',
        align: 'center',
        className: 'w-28',
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return <RecipeItemTypeBadge control={control} index={index} productsMap={productsMap} />;
        },
      },
      {
        key: 'quantity',
        title: 'Cantidad',
        className: 'w-32',
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <RecipeItemQuantityInput
              registration={register(`items.${index}.quantity` as const, { valueAsNumber: true })}
              error={errors.items?.[index]?.quantity}
              badge={<RecipeItemUomBadge control={control} index={index} productsMap={productsMap} />}
            />
          );
        },
      },
      {
        key: 'unitCost',
        title: 'Costo Unit. ($)',
        className: 'w-32',
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <RecipeItemCostInput
              registration={register(`items.${index}.unitCost` as const, { valueAsNumber: true })}
              error={errors.items?.[index]?.unitCost}
            />
          );
        },
      },
      {
        key: 'subtotal',
        title: 'Subtotal ($)',
        align: 'right',
        className: 'w-28 font-mono font-semibold',
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return <RecipeItemSubtotalCell control={control} index={index} />;
        },
      },
      {
        key: 'notes',
        title: 'Notas',
        className: 'min-w-[140px]',
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return (
            <input
              type="text"
              placeholder="Ej: Medida corte, operario..."
              {...register(`items.${index}.notes` as const)}
              className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] text-xs bg-[var(--color-surface-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-sage-500)] transition-all placeholder-[var(--color-text-muted)]"
            />
          );
        },
      },
      {
        key: 'actions',
        title: '',
        align: 'center',
        className: 'w-10',
        render: (field) => {
          const index = itemFields.findIndex((f) => f.id === field.id);
          return <RecipeItemActionCell onRemove={() => removeItem(index)} />;
        },
      },
    ],
    [
      itemFields,
      errors.items,
      register,
      control,
      handleComponentSelect,
      componentProductOptions,
      productsMap,
      removeItem,
    ],
  );

  return { columns, itemFields };
}
