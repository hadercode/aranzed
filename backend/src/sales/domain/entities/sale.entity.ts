import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';
import { SaleType } from '../enums/sale-type.enum';
import { SaleStatus } from '../enums/sale-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { SalePaymentTerm } from '../enums/sale-payment-term.enum';
import { SalePaidStatus } from '../enums/sale-paid-status.enum';
import { SaleItem } from './sale-item.entity';

export class Sale extends BaseEntity {
  saleNumber: string;
  saleType: SaleType;
  paymentTerm: SalePaymentTerm;
  dueDate?: Date | null;
  paidStatus: SalePaidStatus;
  status: SaleStatus;
  customerName: string;
  customerTaxId?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  notes?: string | null;
  paymentMethod: PaymentMethod;
  paymentNotes?: string | null;
  saleDate: Date;
  validUntil?: Date | null;

  // Bimoneda y Tasa de Cambio
  exchangeRate: number;
  functionalCurrency: string;
  localCurrency: string;
  documentCurrency: string;

  // Totales Moneda Funcional (USD)
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;

  // Totales Moneda Local (VES)
  subtotalLocal: number;
  discountAmountLocal: number;
  taxAmountLocal: number;
  totalLocal: number;

  // Montos Cobrados / Pagados
  paidAmount: number;
  paidAmountLocal: number;

  warehouseId?: string | null;
  convertedFromQuotationId?: string | null;
  createdById?: string | null;
  deletedAt?: Date | null;

  items: SaleItem[];

  constructor(partial: Partial<Sale>) {
    super();
    Object.assign(this, partial);
    this.warehouseId = partial.warehouseId || null;
    this.saleType = partial.saleType || SaleType.DIRECT_SALE;
    this.paymentTerm = partial.paymentTerm || SalePaymentTerm.CONTADO;
    this.dueDate = partial.dueDate ? new Date(partial.dueDate) : null;
    this.paidStatus = partial.paidStatus || SalePaidStatus.PENDIENTE;
    this.status = partial.status || SaleStatus.DRAFT;
    this.customerName = partial.customerName?.trim() || 'Consumidor Final';
    this.paymentMethod = partial.paymentMethod || PaymentMethod.CASH;
    this.saleDate = partial.saleDate ? new Date(partial.saleDate) : new Date();
    this.validUntil = partial.validUntil ? new Date(partial.validUntil) : null;
    this.exchangeRate =
      partial.exchangeRate !== undefined && Number(partial.exchangeRate) > 0
        ? Number(partial.exchangeRate)
        : 1.0;
    this.functionalCurrency = partial.functionalCurrency || 'USD';
    this.localCurrency = partial.localCurrency || 'VES';
    this.documentCurrency = partial.documentCurrency || 'USD';

    this.paidAmount = Number(partial.paidAmount || 0);
    this.paidAmountLocal = Number(partial.paidAmountLocal || 0);

    const rate = this.exchangeRate > 0 ? this.exchangeRate : 1.0;

    this.items = partial.items
      ? partial.items.map((i) =>
          i instanceof SaleItem ? i : new SaleItem(i, rate),
        )
      : [];

    this.calculateTotals();
  }

  calculateTotals(): void {
    const rate = this.exchangeRate > 0 ? this.exchangeRate : 1.0;
    let sub = 0;
    let discount = 0;
    let tax = 0;
    let subLocal = 0;
    let discountLocal = 0;
    let taxLocal = 0;

    for (const item of this.items) {
      item.calculateFinancials(rate);
      sub += item.subtotal;
      discount += item.discountAmount;
      tax += item.taxAmount;
      subLocal += item.subtotalLocal;
      discountLocal += item.discountAmountLocal;
      taxLocal += item.taxAmountLocal;
    }

    this.subtotal = Number(sub.toFixed(4));
    this.discountAmount = Number(discount.toFixed(4));
    this.taxAmount = Number(tax.toFixed(4));
    this.total = Number((this.subtotal + this.taxAmount).toFixed(4));

    this.subtotalLocal = Number(subLocal.toFixed(4));
    this.discountAmountLocal = Number(discountLocal.toFixed(4));
    this.taxAmountLocal = Number(taxLocal.toFixed(4));
    this.totalLocal = Number(
      (this.subtotalLocal + this.taxAmountLocal).toFixed(4),
    );
  }

  calculateTotalCost(): number {
    return Number(
      this.items
        .reduce((sum, item) => sum + item.quantity * item.unitCost, 0)
        .toFixed(4),
    );
  }

  calculateGrossProfit(): number {
    const totalCost = this.calculateTotalCost();
    return Number((this.subtotal - totalCost).toFixed(4));
  }

  validate(): void {
    if (!this.saleNumber || this.saleNumber.trim().length === 0) {
      throw new BusinessRuleException(
        'El número de venta/cotización es obligatorio',
      );
    }
    if (!this.customerName || this.customerName.trim().length === 0) {
      throw new BusinessRuleException('El nombre del cliente es obligatorio');
    }
    if (this.customerName.length > 150) {
      throw new BusinessRuleException(
        'El nombre del cliente no puede exceder los 150 caracteres',
      );
    }
    if (!this.saleDate || isNaN(this.saleDate.getTime())) {
      throw new BusinessRuleException('La fecha de emisión es obligatoria');
    }
    if (this.exchangeRate <= 0) {
      throw new BusinessRuleException(
        'La tasa de cambio debe ser mayor a cero',
      );
    }
    if (!this.saleType || !Object.values(SaleType).includes(this.saleType)) {
      throw new BusinessRuleException('El tipo de venta no es válido');
    }
    if (
      !this.paymentTerm ||
      !Object.values(SalePaymentTerm).includes(this.paymentTerm)
    ) {
      throw new BusinessRuleException(
        'El término o condición de pago no es válido',
      );
    }
    if (this.paymentTerm === SalePaymentTerm.CREDITO) {
      if (!this.dueDate || isNaN(this.dueDate.getTime())) {
        throw new BusinessRuleException(
          'Las ventas a crédito deben tener una fecha de vencimiento válida',
        );
      }
    }
    if (
      !this.paidStatus ||
      !Object.values(SalePaidStatus).includes(this.paidStatus)
    ) {
      throw new BusinessRuleException('El estado de pago no es válido');
    }
    if (!this.status || !Object.values(SaleStatus).includes(this.status)) {
      throw new BusinessRuleException('El estado de la venta no es válido');
    }
    if (!this.items || this.items.length === 0) {
      throw new BusinessRuleException(
        'La venta o cotización debe contener al menos un producto',
      );
    }

    for (const item of this.items) {
      item.validate();
    }
  }

  get isCompleted(): boolean {
    return this.status === SaleStatus.COMPLETED;
  }

  get isCancelled(): boolean {
    return this.status === SaleStatus.CANCELLED;
  }

  get isDraft(): boolean {
    return this.status === SaleStatus.DRAFT;
  }

  get isPending(): boolean {
    return this.status === SaleStatus.PENDING;
  }

  transitionTo(newStatus: SaleStatus): void {
    if (this.status === newStatus) return;

    if (this.isCancelled) {
      throw new BusinessRuleException(
        'No se puede modificar el estado de un documento anulado',
      );
    }

    if (this.isCompleted && newStatus === SaleStatus.DRAFT) {
      throw new BusinessRuleException(
        'Una venta completada y confirmada no puede revertirse a borrador',
      );
    }

    this.status = newStatus;
  }

  cancel(reason?: string): void {
    this.transitionTo(SaleStatus.CANCELLED);
    if (reason && reason.trim()) {
      const reasonSuffix = `[ANULADA]: ${reason.trim()}`;
      this.notes = this.notes
        ? `${this.notes} | ${reasonSuffix}`
        : reasonSuffix;
    }
  }

  ensureCanBeUpdated(): void {
    if (this.isCancelled) {
      throw new BusinessRuleException(
        'No se puede modificar un documento anulado',
      );
    }
    if (this.isCompleted) {
      throw new BusinessRuleException(
        'Una venta completada y confirmada es inmutable. Para corregirla, debe ser anulada.',
      );
    }
  }

  ensureCanBeDeleted(): void {
    if (this.isCompleted) {
      throw new BusinessRuleException(
        'Una venta completada y confirmada no puede eliminarse. Debe ser anulada para mantener la trazabilidad de auditoría.',
      );
    }
  }

  changePaidStatus(newPaidStatus: SalePaidStatus): void {
    if (this.paidStatus === newPaidStatus) return;

    if (this.isCancelled) {
      throw new BusinessRuleException(
        'No se puede modificar el estado de pago de una venta anulada',
      );
    }

    if (
      this.saleType === SaleType.QUOTATION &&
      newPaidStatus !== SalePaidStatus.PENDIENTE
    ) {
      throw new BusinessRuleException(
        'Una cotización no puede registrarse con pagos o abonos comerciales. Debe convertirse primero en una venta directa.',
      );
    }

    this.paidStatus = newPaidStatus;
  }

  getBalance(): { balance: number; balanceLocal: number } {
    const bal = Math.max(0, Number((this.total - this.paidAmount).toFixed(4)));
    const balLocal = Math.max(
      0,
      Number((this.totalLocal - this.paidAmountLocal).toFixed(4)),
    );
    return { balance: bal, balanceLocal: balLocal };
  }

  applyPaymentAllocation(
    amountAllocated: number,
    amountAllocatedLocal: number,
    differenceAdjustment = 0,
  ): void {
    if (this.isCancelled) {
      throw new BusinessRuleException(
        'No se puede aplicar un cobro a una venta anulada',
      );
    }
    this.paidAmount = Number(
      (this.paidAmount + amountAllocated + differenceAdjustment).toFixed(4),
    );
    this.paidAmountLocal = Number(
      (this.paidAmountLocal + amountAllocatedLocal).toFixed(4),
    );

    // Si cubre el total (con tolerancia de 1 centavo) o si el ajuste de diferencia cierra la venta
    if (this.paidAmount >= this.total - 0.01) {
      this.paidStatus = SalePaidStatus.PAGADO;
    } else if (this.paidAmount > 0) {
      this.paidStatus = SalePaidStatus.ABONADO;
    } else {
      this.paidStatus = SalePaidStatus.PENDIENTE;
    }
  }

  closeManually(differenceAdjustment: number, reason?: string): void {
    if (this.isCancelled) {
      throw new BusinessRuleException('No se puede cerrar una venta anulada');
    }
    const diff = Number(differenceAdjustment.toFixed(4));
    this.paidAmount = this.total;
    this.paidAmountLocal = this.totalLocal;
    this.paidStatus = SalePaidStatus.PAGADO;
    const note = `[CIERRE MANUAL]: Ajuste de diferencia de $${diff.toFixed(2)}${reason ? ` - Motivo: ${reason.trim()}` : ''}`;
    this.notes = this.notes ? `${this.notes} | ${note}` : note;
  }

  revertPaymentAllocation(
    amountAllocated: number,
    amountAllocatedLocal: number,
    differenceAdjustment = 0,
  ): void {
    this.paidAmount = Math.max(
      0,
      Number(
        (this.paidAmount - amountAllocated - differenceAdjustment).toFixed(4),
      ),
    );
    this.paidAmountLocal = Math.max(
      0,
      Number((this.paidAmountLocal - amountAllocatedLocal).toFixed(4)),
    );

    if (this.paidAmount >= this.total - 0.01) {
      this.paidStatus = SalePaidStatus.PAGADO;
    } else if (this.paidAmount > 0) {
      this.paidStatus = SalePaidStatus.ABONADO;
    } else {
      this.paidStatus = SalePaidStatus.PENDIENTE;
    }
  }

  updateDetails(params: UpdateSaleDetailsParams): void {
    this.ensureCanBeUpdated();

    if (params.saleType !== undefined) this.saleType = params.saleType;
    if (params.paymentTerm !== undefined) this.paymentTerm = params.paymentTerm;
    if (params.dueDate !== undefined) this.dueDate = params.dueDate;
    if (params.customerName !== undefined)
      this.customerName = params.customerName.trim();
    if (params.customerTaxId !== undefined)
      this.customerTaxId = params.customerTaxId?.trim() || null;
    if (params.customerEmail !== undefined)
      this.customerEmail = params.customerEmail?.trim() || null;
    if (params.customerPhone !== undefined)
      this.customerPhone = params.customerPhone?.trim() || null;
    if (params.customerAddress !== undefined)
      this.customerAddress = params.customerAddress?.trim() || null;
    if (params.notes !== undefined) this.notes = params.notes?.trim() || null;
    if (params.paymentMethod !== undefined)
      this.paymentMethod = params.paymentMethod;
    if (params.paymentNotes !== undefined)
      this.paymentNotes = params.paymentNotes?.trim() || null;
    if (params.saleDate !== undefined) this.saleDate = params.saleDate;
    if (params.validUntil !== undefined) this.validUntil = params.validUntil;
    if (params.warehouseId !== undefined)
      this.warehouseId = params.warehouseId || null;

    if (params.exchangeRate !== undefined && Number(params.exchangeRate) > 0) {
      this.exchangeRate = Number(params.exchangeRate);
    }
    if (params.functionalCurrency)
      this.functionalCurrency = params.functionalCurrency;
    if (params.localCurrency) this.localCurrency = params.localCurrency;
    if (params.documentCurrency)
      this.documentCurrency = params.documentCurrency;
  }
}

export interface UpdateSaleDetailsParams {
  saleType?: SaleType;
  paymentTerm?: SalePaymentTerm;
  dueDate?: Date | null;
  customerName?: string;
  customerTaxId?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  notes?: string | null;
  paymentMethod?: PaymentMethod;
  paymentNotes?: string | null;
  saleDate?: Date;
  validUntil?: Date | null;
  warehouseId?: string | null;
  exchangeRate?: number;
  functionalCurrency?: string;
  localCurrency?: string;
  documentCurrency?: string;
}
