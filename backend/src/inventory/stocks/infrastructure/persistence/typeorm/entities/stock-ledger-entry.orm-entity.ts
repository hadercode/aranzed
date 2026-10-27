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
import { InventoryTransactionItemOrmEntity } from '@/inventory/transactions/infrastructure/persistence/typeorm/entities/inventory-transaction-item.orm-entity';
import { InventoryStockOrmEntity } from './inventory-stock.orm-entity';

const numericTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | null | undefined) =>
    value !== null && value !== undefined ? parseFloat(value) : null,
};

const numericTransformerNonNull = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('inventory_stock_ledger_entries')
@Index('IDX_inventory_ledger_stock_item', ['stockId', 'transactionItemId'])
export class StockLedgerEntryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId?: string | null;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId?: string | null;

  @Column({ name: 'transaction_item_id', type: 'uuid' })
  transactionItemId: string;

  @ManyToOne(() => InventoryTransactionItemOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_item_id' })
  transactionItem?: InventoryTransactionItemOrmEntity;

  @Column({ name: 'stock_id', type: 'uuid' })
  stockId: string;

  @ManyToOne(() => InventoryStockOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stock_id' })
  stock?: InventoryStockOrmEntity;

  @Column({
    name: 'quantity',
    type: 'decimal',
    precision: 19,
    scale: 5,
    transformer: numericTransformerNonNull,
  })
  quantity: number;

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
    name: 'unit_cost',
    type: 'decimal',
    precision: 19,
    scale: 5,
    transformer: numericTransformerNonNull,
  })
  unitCost: number;

  @Column({
    name: 'total_cost',
    type: 'decimal',
    precision: 19,
    scale: 5,
    transformer: numericTransformerNonNull,
  })
  totalCost: number;

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
