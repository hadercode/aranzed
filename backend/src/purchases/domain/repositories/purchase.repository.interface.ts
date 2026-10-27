import { Purchase } from '../entities/purchase.entity';
import { PurchaseStatus } from '../enums/purchase-status.enum';

export const PURCHASE_REPOSITORY_TOKEN = 'IPurchaseRepository';
export const PURCHASE_READ_REPOSITORY_TOKEN = 'IPurchaseReadRepository';
export const PURCHASE_WRITE_REPOSITORY_TOKEN = 'IPurchaseWriteRepository';

export interface FindPurchasesFilters {
  search?: string;
  status?: PurchaseStatus;
  startDate?: string;
  endDate?: string;
  supplierName?: string;
  limit?: number;
  offset?: number;
}

/**
 * Contrato de repositorio segregado para operaciones de LECTURA (Queries).
 * Garantiza que los casos de uso de consulta no tengan acceso a métodos mutables.
 */
export interface IPurchaseReadRepository {
  findAll(
    filters?: FindPurchasesFilters,
  ): Promise<{ purchases: Purchase[]; total: number }>;
  findById(id: string): Promise<Purchase | null>;
  findByPurchaseNumber(purchaseNumber: string): Promise<Purchase | null>;
  findByInvoiceNumber(invoiceNumber: string): Promise<Purchase | null>;
}

/**
 * Contrato de repositorio segregado para operaciones de ESCRITURA y persistencia (Commands).
 */
export interface IPurchaseWriteRepository {
  save(purchase: Purchase): Promise<Purchase>;
  delete(id: string): Promise<void>;
  getNextSequenceNumber(): Promise<string>;
}

/**
 * Contrato unificado que combina lectura y escritura.
 * Permite a casos de uso de ciclo de vida completo acceder a ambas capacidades
 * preservando total retrocompatibilidad.
 */
export interface IPurchaseRepository
  extends IPurchaseReadRepository, IPurchaseWriteRepository {}
