import { Injectable, Inject } from '@nestjs/common';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';
import { SalePaidStatus } from '@/sales/domain/enums/sale-paid-status.enum';
import {
  SALE_READ_REPOSITORY_TOKEN,
  type ISaleReadRepository,
} from '@/sales/domain/repositories/sale.repository.interface';

export interface PendingSaleItem {
  id: string;
  saleNumber: string;
  customerName: string;
  customerTaxId?: string | null;
  saleDate: Date;
  dueDate?: Date | null;
  paymentTerm: string;
  status: string;
  paidStatus: string;
  total: number;
  totalLocal: number;
  paidAmount: number;
  paidAmountLocal: number;
  balance: number;
  balanceLocal: number;
  exchangeRate: number;
}

@Injectable()
export class FindPendingSalesByCustomerUseCase {
  constructor(
    @Inject(SALE_READ_REPOSITORY_TOKEN)
    private readonly saleReadRepo: ISaleReadRepository,
  ) {}

  async execute(customerName?: string): Promise<PendingSaleItem[]> {
    // Buscar ventas directas completadas que tengan estado de pago PENDIENTE o ABONADO
    const result = await this.saleReadRepo.findAll({
      customerName: customerName?.trim() || undefined,
      status: SaleStatus.COMPLETED,
      limit: 100,
    });

    const pendingSales = result.sales.filter(
      (s) => s.paidStatus !== SalePaidStatus.PAGADO,
    );

    return pendingSales.map((s) => {
      const { balance, balanceLocal } = s.getBalance();
      return {
        id: s.id,
        saleNumber: s.saleNumber,
        customerName: s.customerName,
        customerTaxId: s.customerTaxId,
        saleDate: s.saleDate,
        dueDate: s.dueDate,
        paymentTerm: s.paymentTerm,
        status: s.status,
        paidStatus: s.paidStatus,
        total: s.total,
        totalLocal: s.totalLocal,
        paidAmount: s.paidAmount,
        paidAmountLocal: s.paidAmountLocal,
        balance,
        balanceLocal,
        exchangeRate: s.exchangeRate,
      };
    });
  }
}
