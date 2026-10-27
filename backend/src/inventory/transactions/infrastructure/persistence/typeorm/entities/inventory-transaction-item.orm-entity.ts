import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryTransactionOrmEntity } from './inventory-transaction.orm-entity';
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

@Entity('inventory_transaction_items')
export class InventoryTransactionItemOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id', type: 'uuid' })
  transactionId: string;

  @ManyToOne(() => InventoryTransactionOrmEntity, (tx) => tx.items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: InventoryTransactionOrmEntity;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product?: ProductOrmEntity;

  @Column({ name: 'variant_id', type: 'uuid', nullable: true })
  variantId?: string | null;

  @Column({ name: 'sku_snapshot', type: 'varchar', length: 100 })
  skuSnapshot: string;

  @Column({ name: 'name_snapshot', type: 'varchar', length: 500 })
  nameSnapshot: string;

  @Column({ name: 'uom_symbol', type: 'varchar', length: 10 })
  uomSymbol: string;

  @Column({
    type: 'decimal',
    precision: 19,
    scale: 5,
    transformer: numericTransformerNonNull,
  })
  quantity: number;

  @Column({
    name: 'cost',
    type: 'decimal',
    precision: 19,
    scale: 5,
    nullable: true,
    transformer: numericTransformer,
  })
  cost?: number | null;

  @Column({
    name: 'sec_quantity',
    type: 'decimal',
    precision: 19,
    scale: 5,
    nullable: true,
    transformer: numericTransformer,
  })
  secQuantity?: number | null;

  @Column({
    name: 'sec_uom_symbol',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  secUomSymbol?: string | null;

  @Column({
    name: 'batch_number',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  batchNumber?: string | null;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate?: Date | null;

  @Column({ name: 'custom_comment', type: 'text', nullable: true })
  customComment?: string | null;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId?: string | null;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId?: string | null;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
