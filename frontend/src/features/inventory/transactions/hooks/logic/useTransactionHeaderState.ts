import { useState, useMemo } from 'react';
import type {
  InventoryTransactionType,
  InventoryTransactionStatus,
} from '../../types';
import type { InventoryReason } from '../../../reasons/types';

export function useTransactionHeaderState(reasons: InventoryReason[] = []) {
  const [txType, setTxType] = useState<InventoryTransactionType>('RECEPTION');
  const [movementDate, setMovementDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [originWarehouseId, setOriginWarehouseId] = useState<string>('');
  const [destWarehouseId, setDestWarehouseId] = useState<string>('');
  const [reasonId, setReasonId] = useState<string>('');
  const [status, setStatus] = useState<InventoryTransactionStatus>('COMPLETED');
  const [referenceEntityType, setReferenceEntityType] = useState<string>('');
  const [referenceEntityId, setReferenceEntityId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

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

  return {
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
    filteredReasons,
  };
}

