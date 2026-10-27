import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { WarehouseOrmEntity } from '@/inventory/warehouses/infrastructure/persistence/typeorm/entities/warehouse.orm-entity';
import { ProductOrmEntity } from '@/catalog/products/infrastructure/persistence/typeorm/entities/product.orm-entity';

const numericTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | null | undefined) =>
    value !== null && value !== undefined ? parseFloat(value) : null,
};

const numericTransformerNonNull = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('inventory_stocks')
@Index('IDX_inventory_stocks_lookup', [
  'warehouseId',
  'productId',
  'isDepleted',
  'entryDate',
])
export class InventoryStockOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId?: string | null;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId?: string | null;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @ManyToOne(() => WarehouseOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse?: WarehouseOrmEntity;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product?: ProductOrmEntity;

  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId?: string | null;

  @Column({ name: 'sku_snapshot', type: 'varchar', length: 100 })
  skuSnapshot: string;

  @Column({ name: 'product_name_snapshot', type: 'varchar', length: 500 })
  productNameSnapshot: string;

  @Column({
    name: 'batch_number',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  batchNumber?: string | null;

  @Column({ name: 'entry_date', type: 'date', default: () => 'CURRENT_DATE' })
  entryDate: Date;

  @Column({
    name: 'uom_original_qty',
    type: 'decimal',
    precision: 19,
    scale: 5,
    default: 0.0,
    transformer: numericTransformerNonNull,
  })
  uomOriginalQty: number;

  @Column({
    name: 'physical_qty',
    type: 'decimal',
    precision: 19,
    scale: 5,
    default: 0.0,
    transformer: numericTransformerNonNull,
  })
  physicalQty: number;

  @Column({
    name: 'reserved_qty',
    type: 'decimal',
    precision: 19,
    scale: 5,
    default: 0.0,
    transformer: numericTransformerNonNull,
  })
  reservedQty: number;

  @Column({ name: 'uom_symbol', type: 'varchar', length: 10 })
  uomSymbol: string;

  @Column({
    name: 'sec_uom_original_qty',
    type: 'decimal',
    precision: 19,
    scale: 5,
    nullable: true,
    transformer: numericTransformer,
  })
  secUomOriginalQty?: number | null;

  @Column({
    name: 'sec_physical_qty',
    type: 'decimal',
    precision: 19,
    scale: 5,
    nullable: true,
    transformer: numericTransformer,
  })
  secPhysicalQty?: number | null;

  @Column({
    name: 'sec_reserved_qty',
    type: 'decimal',
    precision: 19,
    scale: 5,
    nullable: true,
    transformer: numericTransformer,
  })
  secReservedQty?: number | null;

  @Column({
    name: 'sec_uom_symbol',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  secUomSymbol?: string | null;

  @Column({ name: 'exchange_rate_id', type: 'uuid', nullable: true })
  exchangeRateId?: string | null;

  @Column({
    name: 'exchange_rate_snapshot',
    type: 'decimal',
    precision: 19,
    scale: 5,
    default: 1.0,
    transformer: numericTransformerNonNull,
  })
  exchangeRateSnapshot: number;

  @Column({
    name: 'unit_cost_base',
    type: 'decimal',
    precision: 19,
    scale: 5,
    default: 0.0,
    transformer: numericTransformerNonNull,
  })
  unitCostBase: number;

  @Column({
    name: 'currency_code_base',
    type: 'varchar',
    length: 3,
    default: 'USD',
  })
  currencyCodeBase: string;

  @Column({
    name: 'unit_cost_local',
    type: 'decimal',
    precision: 19,
    scale: 5,
    default: 0.0,
    transformer: numericTransformerNonNull,
  })
  unitCostLocal: number;

  @Column({
    name: 'currency_code_local',
    type: 'varchar',
    length: 3,
    default: 'VES',
  })
  currencyCodeLocal: string;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 19,
    scale: 5,
    default: 0.0,
    transformer: numericTransformerNonNull,
  })
  unitCost: number;

  @Column({ name: 'currency_code', type: 'varchar', length: 3, default: 'USD' })
  currencyCode: string;

  @Column({ name: 'is_depleted', type: 'boolean', default: false })
  isDepleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date | null;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string | null;
}
