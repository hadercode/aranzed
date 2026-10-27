import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { InventoryTransactionType } from '../enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '../enums/inventory-transaction-status.enum';

export const INVENTORY_TRANSACTION_REPOSITORY_TOKEN =
  'IInventoryTransactionRepository';
export const INVENTORY_TRANSACTION_READ_REPOSITORY_TOKEN =
  'IInventoryTransactionReadRepository';
export const INVENTORY_TRANSACTION_WRITE_REPOSITORY_TOKEN =
  'IInventoryTransactionWriteRepository';

export interface FindInventoryTransactionsFilters {
  type?: InventoryTransactionType;
  status?: InventoryTransactionStatus;
  warehouseId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}

export interface PaginatedTransactionsQueryResult {
  data: InventoryTransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Contrato de repositorio segregado para operaciones de LECTURA (Queries).
 * Garantiza que los casos de uso de consulta no dependan de métodos mutables.
 */
export interface IInventoryTransactionReadRepository {
  findAll(
    filters?: FindInventoryTransactionsFilters,
  ): Promise<PaginatedTransactionsQueryResult>;
  findById(id: string): Promise<InventoryTransaction | null>;
  findByNumber(transactionNumber: string): Promise<InventoryTransaction | null>;
  findByReference(
    referenceEntityType: string,
    referenceEntityId: string,
  ): Promise<InventoryTransaction | null>;
}

/**
 * Contrato de repositorio segregado para operaciones de ESCRITURA y persistencia (Commands).
 */
export interface IInventoryTransactionWriteRepository {
  save(transaction: InventoryTransaction): Promise<InventoryTransaction>;
  delete(id: string): Promise<void>;
  generateTransactionNumber(): Promise<string>;
}

/**
 * Contrato unificado que combina lectura y escritura.
 */
export interface IInventoryTransactionRepository
  extends
    IInventoryTransactionReadRepository,
    IInventoryTransactionWriteRepository {}
