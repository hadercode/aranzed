import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { PurchaseFormData } from '../../schemas/purchase.schema';
import type { Product } from '@/features/catalog/products/types';
import {
  PurchaseItemUnitCostCell,
  PurchaseItemSubtotalCell,
  PurchaseItemTotalCell,
  PurchaseItemTaxCell,
} from '../../components/form/sections/items/PurchaseItemCells';
import {
  PurchaseItemMaterialSelectCell,
  PurchaseItemDescriptionCell,
  PurchaseItemQuantityCell,
  PurchaseItemRemoveCell,
} from '../../components/form/sections/items/PurchaseItemFormCells';
import type { Column } from '@/shared/components/ui';

export interface BuildPurchaseItemsColumnsParams {
  itemFields: Array<{ id: string }>;
  register: UseFormRegister<PurchaseFormData>;
  control: Control<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
  rawMaterials: Product[];
  functionalSymbol: string;
  localSymbol: string;
  isDocLocal: boolean;
  handleMaterialSelect: (index: number, val: string) => void;
  handleQuantityChange: (index: number, qty: number) => void;
  handleUnitCostChange: (index: number, cost: number) => void;
  handleSubtotalChange: (index: number, subtotal: number) => void;
  handleToggleTaxable: (index: number, isTaxable: boolean) => void;
  removeItem: (index: number) => void;
}

export function buildPurchaseItemsColumns(p: BuildPurchaseItemsColumnsParams): Column<(typeof p.itemFields)[number]>[] {
  const {
    itemFields, register, control, errors, rawMaterials, functionalSymbol, localSymbol, isDocLocal,
    handleMaterialSelect, handleQuantityChange, handleUnitCostChange, handleSubtotalChange, handleToggleTaxable, removeItem,
  } = p;

  return [
    {
      key: 'index',
      title: '#',
      align: 'center',
      className: 'w-10 text-xs font-mono',
      render: (field) => <span className="text-[var(--color-text-muted)] font-mono text-xs">{itemFields.findIndex((f) => f.id === field.id) + 1}</span>,
    },
    {
      key: 'materialId',
      title: 'Material del Catálogo',
      className: 'min-w-[220px]',
      render: (field) => {
        const i = itemFields.findIndex((f) => f.id === field.id);
        return (
          <PurchaseItemMaterialSelectCell
            registration={register(`items.${i}.materialId` as const)}
            onChange={(val) => handleMaterialSelect(i, val)}
            rawMaterials={rawMaterials}
            functionalSymbol={functionalSymbol}
            error={(errors.items as any)?.[i]?.materialId}
          />
        );
      },
    },
    {
      key: 'description',
      title: 'Descripción en Factura',
      className: 'min-w-[180px]',
      render: (field) => {
        const i = itemFields.findIndex((f) => f.id === field.id);
        return <PurchaseItemDescriptionCell registration={register(`items.${i}.description` as const)} error={(errors.items as any)?.[i]?.description} />;
      },
    },
    {
      key: 'quantity',
      title: 'Cantidad',
      className: 'w-24',
      align: 'right',
      render: (field) => {
        const i = itemFields.findIndex((f) => f.id === field.id);
        return (
          <PurchaseItemQuantityCell
            registration={register(`items.${i}.quantity` as const, {
              valueAsNumber: true,
              onChange: (e) => handleQuantityChange(i, parseFloat(e.target.value) || 0),
            })}
            error={(errors.items as any)?.[i]?.quantity}
          />
        );
      },
    },
    {
      key: 'unitCost',
      title: isDocLocal ? `Costo Unit. (${localSymbol})` : `Costo Unit. (${functionalSymbol})`,
      className: 'w-36',
      align: 'right',
      render: (field) => {
        const i = itemFields.findIndex((f) => f.id === field.id);
        return <PurchaseItemUnitCostCell control={control} index={i} onUnitCostChange={handleUnitCostChange} error={(errors.items as any)?.[i]?.unitCost} />;
      },
    },
    {
      key: 'subtotal',
      title: isDocLocal ? `Subtotal (${localSymbol})` : `Subtotal (${functionalSymbol})`,
      align: 'right',
      className: 'w-36',
      render: (field) => {
        const i = itemFields.findIndex((f) => f.id === field.id);
        return <PurchaseItemSubtotalCell control={control} index={i} onSubtotalChange={handleSubtotalChange} error={(errors.items as any)?.[i]?.subtotal} />;
      },
    },
    {
      key: 'isTaxable',
      title: 'IVA (16%)',
      align: 'center',
      className: 'w-24',
      render: (field) => <PurchaseItemTaxCell control={control} index={itemFields.findIndex((f) => f.id === field.id)} onToggleTaxable={handleToggleTaxable} />,
    },
    {
      key: 'total',
      title: `Total (${functionalSymbol} / ${localSymbol})`,
      align: 'right',
      className: 'w-32 font-mono font-bold',
      render: (field) => <PurchaseItemTotalCell control={control} index={itemFields.findIndex((f) => f.id === field.id)} />,
    },
    {
      key: 'actions',
      title: '',
      align: 'center',
      className: 'w-10',
      render: (field) => <PurchaseItemRemoveCell onRemove={() => removeItem(itemFields.findIndex((f) => f.id === field.id))} canRemove={itemFields.length > 1} />,
    },
  ];
}
