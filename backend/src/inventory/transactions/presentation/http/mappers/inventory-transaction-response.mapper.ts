import { InventoryTransaction } from '@/inventory/transactions/domain/entities/inventory-transaction.entity';
import { InventoryTransactionItem } from '@/inventory/transactions/domain/entities/inventory-transaction-item.entity';
import { PaginatedTransactionsQueryResult } from '@/inventory/transactions/domain/repositories/inventory-transaction.repository.interface';
import {
  InventoryTransactionResponseDto,
  InventoryTransactionItemResponseDto,
  PaginatedInventoryTransactionsResponseDto,
} from '../dto';

export class InventoryTransactionResponseMapper {
  static toItemDto(
    item: InventoryTransactionItem,
  ): InventoryTransactionItemResponseDto {
    const dto = new InventoryTransactionItemResponseDto();
    dto.id = item.id!;
    dto.transactionId = item.transactionId;
    dto.productId = item.productId;
    dto.product = item.product || null;
    dto.variantId = item.variantId || null;
    dto.skuSnapshot = item.skuSnapshot;
    dto.nameSnapshot = item.nameSnapshot;
    dto.uomSymbol = item.uomSymbol;
    dto.quantity = item.quantity;
    dto.cost = item.cost !== undefined && item.cost !== null ? item.cost : null;
    dto.secQuantity =
      item.secQuantity !== undefined && item.secQuantity !== null
        ? item.secQuantity
        : null;
    dto.secUomSymbol = item.secUomSymbol || null;
    dto.batchNumber = item.batchNumber || null;
    dto.expiryDate = item.expiryDate
      ? item.expiryDate instanceof Date
        ? item.expiryDate.toISOString()
        : new Date(item.expiryDate).toISOString()
      : null;
    dto.customComment = item.customComment || null;
    return dto;
  }

  static toItemDtoList(
    items: InventoryTransactionItem[] = [],
  ): InventoryTransactionItemResponseDto[] {
    return items.map((item) => this.toItemDto(item));
  }

  static toDto(
    transaction: InventoryTransaction,
  ): InventoryTransactionResponseDto {
    const dto = new InventoryTransactionResponseDto();
    dto.id = transaction.id;
    dto.transactionNumber = transaction.transactionNumber;
    dto.type = transaction.type;
    dto.reasonId = transaction.reasonId || null;
    dto.reason = transaction.reason || null;
    dto.originWarehouseId = transaction.originWarehouseId || null;
    dto.originWarehouse = transaction.originWarehouse || null;
    dto.destWarehouseId = transaction.destWarehouseId || null;
    dto.destWarehouse = transaction.destWarehouse || null;
    dto.status = transaction.status;
    dto.movementDate = transaction.movementDate
      ? transaction.movementDate instanceof Date
        ? transaction.movementDate.toISOString().slice(0, 10)
        : String(transaction.movementDate).slice(0, 10)
      : new Date().toISOString().slice(0, 10);
    dto.referenceEntityType = transaction.referenceEntityType || null;
    dto.referenceEntityId = transaction.referenceEntityId || null;
    dto.notes = transaction.notes || null;
    dto.documents = transaction.documents || null;
    dto.items = this.toItemDtoList(transaction.items || []);
    dto.createdById = transaction.createdById || null;
    dto.createdAt = transaction.createdAt
      ? transaction.createdAt.toISOString()
      : undefined;
    dto.updatedAt = transaction.updatedAt
      ? transaction.updatedAt.toISOString()
      : undefined;
    return dto;
  }

  static toDtoList(
    transactions: InventoryTransaction[] = [],
  ): InventoryTransactionResponseDto[] {
    return transactions.map((tx) => this.toDto(tx));
  }

  static toPaginatedDto(
    result: PaginatedTransactionsQueryResult,
  ): PaginatedInventoryTransactionsResponseDto {
    const dto = new PaginatedInventoryTransactionsResponseDto();
    dto.data = this.toDtoList(result.data);
    dto.total = result.total;
    dto.page = result.page;
    dto.limit = result.limit;
    dto.totalPages = result.totalPages;
    return dto;
  }
}
