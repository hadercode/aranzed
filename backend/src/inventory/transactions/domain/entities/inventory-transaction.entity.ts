import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { InventoryTransactionType } from '../enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '../enums/inventory-transaction-status.enum';
import { InventoryTransactionItem } from './inventory-transaction-item.entity';

export class InventoryTransaction extends BaseEntity {
  tenantId?: string | null;
  companyId?: string | null;
  transactionNumber: string;
  type: InventoryTransactionType;
  reasonId?: string | null;
  originWarehouseId?: string | null;
  destWarehouseId?: string | null;
  status: InventoryTransactionStatus;
  movementDate: Date;
  referenceEntityType?: string | null;
  referenceEntityId?: string | null;
  notes?: string | null;
  documents?: string[] | null;
  createdById?: string | null;
  deletedAt?: Date | null;
  items: InventoryTransactionItem[];

  // Relaciones cargadas para vistas
  reason?: { id: string; name: string; type: string } | null;
  originWarehouse?: { id: string; name: string; code: string } | null;
  destWarehouse?: { id: string; name: string; code: string } | null;

  constructor(partial?: Partial<InventoryTransaction>) {
    super();
    if (partial) {
      Object.assign(this, partial);
      this.status = partial.status || InventoryTransactionStatus.DRAFT;
      this.movementDate = partial.movementDate
        ? partial.movementDate instanceof Date
          ? partial.movementDate
          : new Date(partial.movementDate)
        : new Date();
      this.items = partial.items
        ? partial.items.map((item) =>
            item instanceof InventoryTransactionItem
              ? item
              : new InventoryTransactionItem(item),
          )
        : [];
    } else {
      this.status = InventoryTransactionStatus.DRAFT;
      this.movementDate = new Date();
      this.items = [];
    }
  }

  get isCompleted(): boolean {
    return this.status === InventoryTransactionStatus.COMPLETED;
  }

  get isDraft(): boolean {
    return this.status === InventoryTransactionStatus.DRAFT;
  }

  get isCancelled(): boolean {
    return this.status === InventoryTransactionStatus.CANCELLED;
  }

  get isInTransit(): boolean {
    return this.status === InventoryTransactionStatus.IN_TRANSIT;
  }

  validate(): void {
    if (
      !this.type ||
      !Object.values(InventoryTransactionType).includes(this.type)
    ) {
      throw new BusinessRuleException('El tipo de transacción es inválido');
    }

    if (!this.items || this.items.length === 0) {
      throw new BusinessRuleException(
        'La transacción de inventario debe incluir al menos un producto',
      );
    }

    for (const item of this.items) {
      item.validate();
    }

    if (this.type === InventoryTransactionType.RECEPTION) {
      if (!this.destWarehouseId) {
        throw new BusinessRuleException(
          'El almacén de destino es requerido para recepciones de inventario',
        );
      }
    } else if (this.type === InventoryTransactionType.ISSUE) {
      if (!this.originWarehouseId) {
        throw new BusinessRuleException(
          'El almacén de origen es requerido para salidas de inventario',
        );
      }
    } else if (this.type === InventoryTransactionType.TRANSFER) {
      if (!this.originWarehouseId || !this.destWarehouseId) {
        throw new BusinessRuleException(
          'Se requieren ambos almacenes (origen y destino) para transferencias',
        );
      }
      if (this.originWarehouseId === this.destWarehouseId) {
        throw new BusinessRuleException(
          'El almacén de origen y destino no pueden ser el mismo',
        );
      }
    } else if (this.type === InventoryTransactionType.ADJUSTMENT) {
      if (!this.reasonId) {
        throw new BusinessRuleException(
          'El motivo de inventario es requerido para transacciones de ajuste',
        );
      }
    }
  }

  transitionTo(newStatus: InventoryTransactionStatus): void {
    if (this.status === newStatus) return;

    if (this.status === InventoryTransactionStatus.CANCELLED) {
      throw new BusinessRuleException(
        'No se puede modificar el estado de una transacción cancelada',
      );
    }

    if (
      this.status === InventoryTransactionStatus.COMPLETED &&
      newStatus === InventoryTransactionStatus.DRAFT
    ) {
      throw new BusinessRuleException(
        'Una transacción completada no puede revertirse directamente a borrador',
      );
    }

    this.status = newStatus;
  }

  ensureCanBeUpdated(): void {
    if (this.status === InventoryTransactionStatus.COMPLETED) {
      throw new BusinessRuleException(
        'No se puede modificar una transacción ya completada',
      );
    }
    if (this.status === InventoryTransactionStatus.CANCELLED) {
      throw new BusinessRuleException(
        'No se puede modificar una transacción cancelada',
      );
    }
  }

  ensureCanBeDeleted(): void {
    if (this.status === InventoryTransactionStatus.CANCELLED) {
      throw new BusinessRuleException(
        'La transacción ya se encuentra cancelada',
      );
    }
  }
}
