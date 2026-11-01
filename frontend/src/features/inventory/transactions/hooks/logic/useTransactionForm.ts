import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeedbackStore, useCurrencyStore } from '@/shared/hooks/store';
import { useWarehousesQuery } from '../../../warehouses/hooks';
import { useReasonsQuery } from '../../../reasons/hooks';
import { useTransactionFormDataQuery } from '../queries/useTransactionFormDataQuery';
import { useTransactionFormItems } from './useTransactionFormItems';
import { useTransactionCalculations } from './useTransactionCalculations';
import { useTransactionMutations } from '../mutations/useTransactionMutations';
import { useTransactionHeaderState } from './useTransactionHeaderState';
import { mapTransactionItemsToForm } from './hydrateTransactionForm';
import type { CreateInventoryTransactionDto } from '../../types';

export function useTransactionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { showSuccess, showError } = useFeedbackStore();
  const { functionalSymbol, localSymbol } = useCurrencyStore();

  const { warehouses } = useWarehousesQuery();
  const { reasons } = useReasonsQuery();
  const { createTransaction, updateTransaction, isMutating } = useTransactionMutations();
  const { products, initialTransaction, isLoadingInitial, loadError } = useTransactionFormDataQuery(id);

  const header = useTransactionHeaderState(reasons);
  const { items, setItems, addItem, removeItem, updateItem, selectProduct } = useTransactionFormItems(products);
  const metrics = useTransactionCalculations(items);

  useEffect(() => {
    if (!initialTransaction) return;
    header.setTxType(initialTransaction.type);
    header.setMovementDate(
      initialTransaction.movementDate
        ? initialTransaction.movementDate.slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    );
    header.setOriginWarehouseId(initialTransaction.originWarehouseId || '');
    header.setDestWarehouseId(initialTransaction.destWarehouseId || '');
    header.setReasonId(initialTransaction.reasonId || '');
    header.setStatus(initialTransaction.status);
    header.setReferenceEntityType(initialTransaction.referenceEntityType || '');
    header.setReferenceEntityId(initialTransaction.referenceEntityId || '');
    header.setNotes(initialTransaction.notes || '');

    if (initialTransaction.items && initialTransaction.items.length > 0) {
      setItems(mapTransactionItemsToForm(initialTransaction.items));
    }
  }, [initialTransaction, setItems]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if ((header.txType === 'RECEPTION' || header.txType === 'TRANSFER') && !header.destWarehouseId) {
      showError(new Error('Debe seleccionar el almacén de destino'), { title: 'Almacén Destino Requerido' });
      return;
    }
    if ((header.txType === 'ISSUE' || header.txType === 'TRANSFER') && !header.originWarehouseId) {
      showError(new Error('Debe seleccionar el almacén de origen'), { title: 'Almacén Origen Requerido' });
      return;
    }
    if (header.txType === 'TRANSFER' && header.originWarehouseId === header.destWarehouseId) {
      showError(new Error('El almacén de origen y destino no pueden ser el mismo'), { title: 'Transferencia Inválida' });
      return;
    }

    const validItems = items.filter((it) => it.productId && Number(it.quantity) > 0);
    if (validItems.length === 0) {
      showError(new Error('Agregue al menos un producto con cantidad mayor a cero'), { title: 'Ítems Incompletos' });
      return;
    }

    try {
      if (isEditMode && id) {
        await updateTransaction({
          id,
          data: {
            movementDate: header.movementDate,
            status: header.status,
            notes: header.notes || undefined,
          },
        });
        showSuccess('Transacción de inventario actualizada con éxito');
      } else {
        const payload: CreateInventoryTransactionDto = {
          type: header.txType,
          movementDate: header.movementDate,
          originWarehouseId: header.originWarehouseId || undefined,
          destWarehouseId: header.destWarehouseId || undefined,
          reasonId: header.reasonId || undefined,
          status: header.status,
          referenceEntityType: header.referenceEntityType || undefined,
          referenceEntityId: header.referenceEntityId || undefined,
          notes: header.notes || undefined,
          items: validItems.map((it) => ({
            productId: it.productId,
            skuSnapshot: it.skuSnapshot,
            nameSnapshot: it.nameSnapshot,
            uomSymbol: it.uomSymbol,
            quantity: Number(it.quantity),
            cost: it.cost ? Number(it.cost) : undefined,
            secQuantity: it.secQuantity ? Number(it.secQuantity) : undefined,
            secUomSymbol: it.secUomSymbol || undefined,
            batchNumber: it.batchNumber || undefined,
            expiryDate: it.expiryDate || undefined,
            customComment: it.customComment || undefined,
          })),
        };
        await createTransaction(payload);
        showSuccess('Movimiento de inventario registrado correctamente');
      }
      navigate('/inventory/transactions');
    } catch (err: any) {
      showError(err, { title: 'Error al procesar movimiento' });
    }
  };

  return {
    isEditMode,
    id,
    loadingInitial: isLoadingInitial,
    loadError,
    isMutating,
    ...header,
    items,
    addItem,
    removeItem,
    updateItem,
    selectProduct,
    warehouses,
    reasons,
    products,
    metrics,
    functionalSymbol,
    localSymbol,
    handleSubmit,
    handleCancel: () => navigate('/inventory/transactions'),
  };
}

export type UseTransactionFormReturn = ReturnType<typeof useTransactionForm>;
export default useTransactionForm;
