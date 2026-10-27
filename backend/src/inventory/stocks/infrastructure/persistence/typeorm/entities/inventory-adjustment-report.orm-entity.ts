import { Entity, Column, PrimaryColumn } from 'typeorm';

const numericTransformerNonNull = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity({ name: 'v_inventory_adjustments_report', synchronize: false })
export class InventoryAdjustmentReportOrmEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid' })
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId?: string | null;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId?: string | null;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ name: 'adjustment_reason', type: 'varchar' })
  adjustmentReason: string;

  @Column({ name: 'transaction_type', type: 'varchar' })
  transactionType: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId?: string | null;

  @Column({ name: 'sku_snapshot', type: 'varchar' })
  skuSnapshot: string;

  @Column({ name: 'name_snapshot', type: 'varchar' })
  nameSnapshot: string;

  @Column({ name: 'uom_symbol', type: 'varchar' })
  uomSymbol: string;

  @Column({
    name: 'quantity_adjusted',
    type: 'decimal',
    transformer: numericTransformerNonNull,
  })
  quantityAdjusted: number;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    transformer: numericTransformerNonNull,
  })
  unitCost: number;

  @Column({
    name: 'cost_impact',
    type: 'decimal',
    transformer: numericTransformerNonNull,
  })
  costImpact: number;

  @Column({ name: 'movement_date', type: 'date' })
  movementDate: Date;

  @Column({ name: 'transaction_number', type: 'varchar' })
  transactionNumber: string;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string | null;
}
