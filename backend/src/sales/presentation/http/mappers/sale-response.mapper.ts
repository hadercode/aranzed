import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleItem } from '@/sales/domain/entities/sale-item.entity';
import { SaleStatsSummary } from '@/sales/domain/repositories/sale.repository.interface';
import {
  SaleResponseDto,
  SaleItemResponseDto,
  SaleStatsResponseDto,
} from '../dto';

export class SaleResponseMapper {
  static toItemDto(item: SaleItem): SaleItemResponseDto {
    const dto = new SaleItemResponseDto();
    dto.id = item.id;
    dto.saleId = item.saleId;
    dto.productId = item.productId;
    dto.description = item.description;
    dto.productType = item.productType || 'TRADITIONAL';
    dto.quantity = item.quantity;
    dto.unitPrice = item.unitPrice;
    dto.unitCost = item.unitCost;
    dto.discountRate = item.discountRate;
    dto.discountAmount = item.discountAmount;
    dto.isTaxable = item.isTaxable;
    dto.taxRate = item.taxRate;
    dto.taxAmount = item.taxAmount;
    dto.subtotal = item.subtotal;
    dto.total = item.total;
    dto.unitPriceLocal = item.unitPriceLocal;
    dto.subtotalLocal = item.subtotalLocal;
    dto.discountAmountLocal = item.discountAmountLocal;
    dto.taxAmountLocal = item.taxAmountLocal;
    dto.totalLocal = item.totalLocal;
    dto.currencySymbolFunctional = item.currencySymbolFunctional;
    dto.currencySymbolLocal = item.currencySymbolLocal;
    dto.sortOrder = item.sortOrder;
    dto.product = item.product || null;
    return dto;
  }

  static toDto(sale: Sale): SaleResponseDto {
    const dto = new SaleResponseDto();
    dto.id = sale.id;
    dto.saleNumber = sale.saleNumber;
    dto.saleType = sale.saleType;
    dto.paymentTerm = sale.paymentTerm;
    dto.dueDate = sale.dueDate ? sale.dueDate.toISOString() : null;
    dto.paidStatus = sale.paidStatus;
    dto.status = sale.status;
    dto.customerName = sale.customerName;
    dto.customerTaxId = sale.customerTaxId || null;
    dto.customerEmail = sale.customerEmail || null;
    dto.customerPhone = sale.customerPhone || null;
    dto.customerAddress = sale.customerAddress || null;
    dto.notes = sale.notes || null;
    dto.paymentMethod = sale.paymentMethod;
    dto.paymentNotes = sale.paymentNotes || null;
    dto.saleDate = sale.saleDate
      ? sale.saleDate.toISOString()
      : new Date().toISOString();
    dto.validUntil = sale.validUntil ? sale.validUntil.toISOString() : null;
    dto.exchangeRate = sale.exchangeRate;
    dto.functionalCurrency = sale.functionalCurrency;
    dto.localCurrency = sale.localCurrency;
    dto.documentCurrency = sale.documentCurrency;
    dto.subtotal = sale.subtotal;
    dto.discountAmount = sale.discountAmount;
    dto.taxAmount = sale.taxAmount;
    dto.total = sale.total;
    dto.subtotalLocal = sale.subtotalLocal;
    dto.discountAmountLocal = sale.discountAmountLocal;
    dto.taxAmountLocal = sale.taxAmountLocal;
    dto.totalLocal = sale.totalLocal;
    dto.paidAmount = Number(sale.paidAmount || 0);
    dto.paidAmountLocal = Number(sale.paidAmountLocal || 0);
    const { balance, balanceLocal } = sale.getBalance();
    dto.balance = balance;
    dto.balanceLocal = balanceLocal;
    dto.warehouseId = sale.warehouseId || null;
    dto.convertedFromQuotationId = sale.convertedFromQuotationId || null;
    dto.createdById = sale.createdById || null;
    dto.createdAt = sale.createdAt ? sale.createdAt.toISOString() : undefined;
    dto.updatedAt = sale.updatedAt ? sale.updatedAt.toISOString() : undefined;
    dto.items = sale.items
      ? sale.items.map((item) => this.toItemDto(item))
      : [];
    return dto;
  }

  static toDtoList(sales: Sale[]): SaleResponseDto[] {
    return (sales || []).map((sale) => this.toDto(sale));
  }

  static toStatsDto(stats: SaleStatsSummary): SaleStatsResponseDto {
    const dto = new SaleStatsResponseDto();
    dto.totalSalesCount = stats.totalSalesCount;
    dto.totalQuotationsCount = stats.totalQuotationsCount;
    dto.completedSalesCount = stats.completedSalesCount;
    dto.draftCount = stats.draftCount;
    dto.cancelledCount = stats.cancelledCount;
    dto.totalRevenueUSD = stats.totalRevenueUSD;
    dto.totalRevenueLocal = stats.totalRevenueLocal;
    dto.averageTicketUSD = stats.averageTicketUSD;
    return dto;
  }
}
