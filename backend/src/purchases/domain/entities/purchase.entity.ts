import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { PurchaseItem } from './purchase-item.entity';

export class Purchase extends BaseEntity {
  purchaseNumber: string;
  supplierName: string;
  purchaseDate: Date;
  description?: string | null;
  status: PurchaseStatus;
  invoiceNumber: string;

  // Bimoneda y Tasa de Cambio
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency: string;

  // Totales Moneda Funcional (USD)
  subtotal: number;
  taxAmount: number;
  total: number;

  // Totales Moneda Local (VES)
  subtotalLocal: number;
  taxAmountLocal: number;
  totalLocal: number;

  // Almacén de Recepción
  warehouseId?: string | null;

  createdById?: string | null;
  deletedAt?: Date | null;

  items: PurchaseItem[];

  constructor(partial: Partial<Purchase>) {
    super();
    Object.assign(this, partial);
    this.warehouseId = partial.warehouseId || null;
    this.status = partial.status || PurchaseStatus.DRAFT;
    this.purchaseDate = partial.purchaseDate
      ? new Date(partial.purchaseDate)
      : new Date();
    this.exchangeRate =
      partial.exchangeRate !== undefined ? Number(partial.exchangeRate) : 1.0;
    this.functionalCurrency = partial.functionalCurrency || 'USD';
    this.localCurrency = partial.localCurrency || 'VES';
    this.documentCurrency = partial.documentCurrency || 'USD';

    const rate = this.exchangeRate > 0 ? this.exchangeRate : 1.0;

    this.items = partial.items
      ? partial.items.map((i) =>
          i instanceof PurchaseItem ? i : new PurchaseItem(i, rate),
        )
      : [];

    this.calculateTotals();
  }

  calculateTotals(): void {
    const rate = this.exchangeRate > 0 ? this.exchangeRate : 1.0;
    let sub = 0;
    let tax = 0;
    let subLocal = 0;
    let taxLocal = 0;

    for (const item of this.items) {
      item.calculateFinancials(rate);
      sub += item.subtotal;
      tax += item.taxAmount;
      subLocal += item.subtotalLocal;
      taxLocal += item.taxAmountLocal;
    }

    this.subtotal = Number(sub.toFixed(4));
    this.taxAmount = Number(tax.toFixed(4));
    this.total = Number((this.subtotal + this.taxAmount).toFixed(4));

    this.subtotalLocal = Number(subLocal.toFixed(4));
    this.taxAmountLocal = Number(taxLocal.toFixed(4));
    this.totalLocal = Number(
      (this.subtotalLocal + this.taxAmountLocal).toFixed(4),
    );
  }

  validate(): void {
    if (!this.supplierName || this.supplierName.trim().length === 0) {
      throw new BusinessRuleException('El nombre del proveedor es obligatorio');
    }
    if (this.supplierName.trim().length > 150) {
      throw new BusinessRuleException(
        'El nombre del proveedor no puede exceder los 150 caracteres',
      );
    }
    if (!this.invoiceNumber || this.invoiceNumber.trim().length === 0) {
      throw new BusinessRuleException(
        'El número de factura o documento es obligatorio',
      );
    }
    if (!this.purchaseDate || isNaN(this.purchaseDate.getTime())) {
      throw new BusinessRuleException('La fecha de la compra es obligatoria');
    }
    if (this.exchangeRate <= 0) {
      throw new BusinessRuleException(
        'La tasa de cambio debe ser mayor a cero',
      );
    }
    if (!this.status || !Object.values(PurchaseStatus).includes(this.status)) {
      throw new BusinessRuleException('El estado de la compra no es válido');
    }
    if (!this.items || this.items.length === 0) {
      throw new BusinessRuleException(
        'La compra debe contener al menos un material en su detalle',
      );
    }

    for (const item of this.items) {
      item.validate();
    }
  }

  get isCompleted(): boolean {
    return this.status === PurchaseStatus.COMPLETED;
  }

  get isCancelled(): boolean {
    return this.status === PurchaseStatus.CANCELLED;
  }

  get isDraft(): boolean {
    return this.status === PurchaseStatus.DRAFT;
  }

  /**
   * Ejecuta la transición de estado controlada validando las invariantes de negocio del ciclo de vida.
   */
  transitionTo(newStatus: PurchaseStatus): void {
    if (this.status === newStatus) {
      return;
    }

    if (this.isCancelled) {
      throw new BusinessRuleException(
        'No se puede cambiar el estado de una compra anulada/cancelada',
      );
    }

    if (this.isCompleted && newStatus === PurchaseStatus.DRAFT) {
      throw new BusinessRuleException(
        'Una compra completada no puede revertirse a borrador',
      );
    }

    this.status = newStatus;
  }

  /**
   * Valida si la compra puede ser modificada.
   */
  ensureCanBeUpdated(): void {
    if (this.isCompleted) {
      throw new BusinessRuleException(
        'No se puede modificar una compra que ya se encuentra en estado COMPLETADA',
      );
    }
  }

  /**
   * Valida si la compra puede ser eliminada físicamente o por soft-delete.
   */
  ensureCanBeDeleted(): void {
    if (this.isCompleted) {
      throw new BusinessRuleException(
        'No se puede eliminar una compra que ya está en estado COMPLETADA. Puede anularla cambiando su estado a CANCELADA.',
      );
    }
  }
}
