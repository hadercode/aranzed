import { Sale } from '../entities/sale.entity';
import { SaleType } from '../enums/sale-type.enum';
import { SaleStatus } from '../enums/sale-status.enum';
import { SalePaymentTerm } from '../enums/sale-payment-term.enum';
import { SalePaidStatus } from '../enums/sale-paid-status.enum';

export const SALE_REPOSITORY_TOKEN = 'ISaleRepository';
export const SALE_READ_REPOSITORY_TOKEN = 'ISaleReadRepository';
export const SALE_WRITE_REPOSITORY_TOKEN = 'ISaleWriteRepository';

export interface FindSalesFilters {
  search?: string;
  saleType?: SaleType;
  paymentTerm?: SalePaymentTerm;
  paidStatus?: SalePaidStatus;
  status?: SaleStatus;
  startDate?: string;
  endDate?: string;
  customerName?: string;
  limit?: number;
  offset?: number;
}

export interface SaleStatsSummary {
  totalSalesCount: number;
  totalQuotationsCount: number;
  completedSalesCount: number;
  draftCount: number;
  cancelledCount: number;
  totalRevenueUSD: number;
  totalRevenueLocal: number;
  averageTicketUSD: number;
}

/**
 * Contrato de repositorio segregado para operaciones de LECTURA (Queries).
 * Garantiza que los casos de uso de consulta no tengan acceso a métodos de mutación.
 */
export interface ISaleReadRepository {
  findAll(
    filters?: FindSalesFilters,
  ): Promise<{ sales: Sale[]; total: number }>;
  findById(id: string): Promise<Sale | null>;
  findBySaleNumber(saleNumber: string): Promise<Sale | null>;
  getStats(filters?: FindSalesFilters): Promise<SaleStatsSummary>;
}

/**
 * Contrato de repositorio segregado para operaciones de ESCRITURA y persistencia (Commands).
 */
export interface ISaleWriteRepository {
  save(sale: Sale): Promise<Sale>;
  delete(id: string): Promise<void>;
  getNextSequenceNumber(type: SaleType): Promise<string>;
}

/**
 * Contrato unificado que combina lectura y escritura.
 * Permite retrocompatibilidad y acceso a ambas capacidades en casos de uso de ciclo completo.
 */
export interface ISaleRepository
  extends ISaleReadRepository, ISaleWriteRepository {}
