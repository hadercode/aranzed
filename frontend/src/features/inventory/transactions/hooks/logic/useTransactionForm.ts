import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeedbackStore, useCurrencyStore } from '@/shared/hooks/store';
import { useWarehousesQuery } from '../../../warehouses/hooks';
import { useReasonsQuery } from '../../../reasons/hooks';
import { useTransactionFormDataQuery } from '../queries/useTransactionFormDataQuery';
import { useTransactionFormItems } from './useTransactionFormItems';
import { useTransactionCalculations } from './useTransactionCalculations';
import { useTransactionMutations } from '../mutations/useTransactionMutations';
import type {
  InventoryTransactionType,
  InventoryTransactionStatus,
  CreateInventoryTransactionDto,
} from '../../types';

export function useTransactionForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const { showSuccess, showError } = useFeedbackStore();
  const { functionalSymbol, localSymbol } = useCurrencyStore();

  const { warehouses } = useWarehousesQuery();
  const { reasons } = useReasonsQuery();
  const { createTransaction, updateTransaction, isMutating } = useTransactionMutations();

  // 1. Carga paralela de catálogos y datos iniciales (si es edición)
  const {
    products,
    initialTransaction,
    isLoadingInitial,
    loadError,
  } = useTransactionFormDataQuery(id);

  // 2. Estado de cabecera
  const [txType, setTxType] = useState<InventoryTransactionType>('RECEPTION');
  const [movementDate, setMovementDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [originWarehouseId, setOriginWarehouseId] = useState<string>('');
  const [destWarehouseId, setDestWarehouseId] = useState<string>('');
  const [reasonId, setReasonId] = useState<string>('');
  const [status, setStatus] = useState<InventoryTransactionStatus>('COMPLETED');
  const [referenceEntityType, setReferenceEntityType] = useState<string>('');
  const [referenceEntityId, setReferenceEntityId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // 3. Manejo de renglones dinámicos (Hook especializado)
  const {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    selectProduct,
  } = useTransactionFormItems(products);

  // 4. Cálculos y métricas matemáticas aisladas (Hook especializado)
  const metrics = useTransactionCalculations(items);

  // 5. Sincronizar datos si estamos en modo edición
  useEffect(() => {
    if (initialTransaction) {
      setTxType(initialTransaction.type);
      setMovementDate(
        initialTransaction.movementDate
          ? initialTransaction.movementDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      );
      setOriginWarehouseId(initialTransaction.originWarehouseId || '');
      setDestWarehouseId(initialTransaction.destWarehouseId || '');
      setReasonId(initialTransaction.reasonId || '');
      setStatus(initialTransaction.status);
      setReferenceEntityType(initialTransaction.referenceEntityType || '');
      setReferenceEntityId(initialTransaction.referenceEntityId || '');
      setNotes(initialTransaction.notes || '');

      if (initialTransaction.items && initialTransaction.items.length > 0) {
        setItems(
          initialTransaction.items.map((it) => ({
            id: it.id,
            productId: it.productId,
            skuSnapshot: it.skuSnapshot,
            nameSnapshot: it.nameSnapshot,
            uomSymbol: it.uomSymbol,
            quantity: Number(it.quantity),
            cost: Number(it.cost || 0),
            secQuantity: it.secQuantity ? Number(it.secQuantity) : undefined,
            secUomSymbol: it.secUomSymbol || undefined,
            batchNumber: it.batchNumber || '',
            expiryDate: it.expiryDate ? it.expiryDate.slice(0, 10) : '',
            customComment: it.customComment || '',
          })),
        );
      }
    }
  }, [initialTransaction, setItems]);

  // 6. Motivos filtrados según tipo de transacción
  const filteredReasons = useMemo(() => {
    if (!reasons || reasons.length === 0) return [];
    if (txType === 'RECEPTION') {
      return reasons.filter((r) => r.type === 'INPUT' || r.type === 'BOTH');
    }
    if (txType === 'ISSUE') {
      return reasons.filter((r) => r.type === 'OUTPUT' || r.type === 'BOTH');
    }
    return reasons;
  }, [reasons, txType]);

  // 7. Envío y validaciones de negocio
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if ((txType === 'RECEPTION' || txType === 'TRANSFER') && !destWarehouseId) {
      showError(new Error('Debe seleccionar el almacén de destino'), {
        title: 'Almacén Destino Requerido',
      });
      return;
    }

    if ((txType === 'ISSUE' || txType === 'TRANSFER') && !originWarehouseId) {
      showError(new Error('Debe seleccionar el almacén de origen'), {
        title: 'Almacén Origen Requerido',
      });
      return;
    }

    if (txType === 'TRANSFER' && originWarehouseId === destWarehouseId) {
      showError(new Error('El almacén de origen y destino no pueden ser el mismo'), {
        title: 'Transferencia Inválida',
      });
      return;
    }

    const validItems = items.filter((it) => it.productId && Number(it.quantity) > 0);
    if (validItems.length === 0) {
      showError(new Error('Agregue al menos un producto con cantidad mayor a cero'), {
        title: 'Ítems Incompletos',
      });
      return;
    }

    try {
      if (isEditMode && id) {
        await updateTransaction({
          id,
          data: {
            movementDate,
            status,
            notes: notes || undefined,
          },
        });
        showSuccess('Transacción de inventario actualizada con éxito');
      } else {
        const payload: CreateInventoryTransactionDto = {
          type: txType,
          movementDate,
          originWarehouseId: originWarehouseId || undefined,
          destWarehouseId: destWarehouseId || undefined,
          reasonId: reasonId || undefined,
          status,
          referenceEntityType: referenceEntityType || undefined,
          referenceEntityId: referenceEntityId || undefined,
          notes: notes || undefined,
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

  const handleCancel = () => {
    navigate('/inventory/transactions');
  };

  return {
    isEditMode,
    id,
    loadingInitial: isLoadingInitial,
    loadError,
    isMutating,

    // Header State
    txType,
    setTxType,
    movementDate,
    setMovementDate,
    originWarehouseId,
    setOriginWarehouseId,
    destWarehouseId,
    setDestWarehouseId,
    reasonId,
    setReasonId,
    status,
    setStatus,
    referenceEntityType,
    setReferenceEntityType,
    referenceEntityId,
    setReferenceEntityId,
    notes,
    setNotes,

    // Items
    items,
    addItem,
    removeItem,
    updateItem,
    selectProduct,

    // Catalogs
    warehouses,
    reasons,
    products,
    filteredReasons,

    // Metrics & Currencies
    metrics,
    functionalSymbol,
    localSymbol,

    // Actions
    handleSubmit,
    handleCancel,
  };
}

export type UseTransactionFormReturn = ReturnType<typeof useTransactionForm>;
export default useTransactionForm;
