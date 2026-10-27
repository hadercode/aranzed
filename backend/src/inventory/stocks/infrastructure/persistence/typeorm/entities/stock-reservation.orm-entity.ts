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
import { InventoryStockOrmEntity } from './inventory-stock.orm-entity';
import { StockReservationStatus } from '@/inventory/stocks/domain/enums/stock-reservation-status.enum';

const numericTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | null | undefined) =>
    value !== null && value !== undefined ? parseFloat(value) : null,
};

const numericTransformerNonNull = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity('inventory_stock_reservations')
@Index('IDX_inventory_reservations_ref', ['referenceType', 'referenceId'])
export class StockReservationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId?: string | null;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId?: string | null;

  @Column({ name: 'stock_id', type: 'uuid' })
  stockId: string;

  @ManyToOne(() => InventoryStockOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'stock_id' })
  stock?: InventoryStockOrmEntity;

  @Column({ name: 'reference_type', type: 'varchar', length: 50 })
  referenceType: string;

  @Column({ name: 'reference_id', type: 'uuid' })
  referenceId: string;

  @Column({ name: 'reference_item_id', type: 'uuid', nullable: true })
  referenceItemId?: string | null;

  @Column({
    name: 'reserved_qty',
    type: 'decimal',
    precision: 19,
    scale: 5,
    transformer: numericTransformerNonNull,
  })
  reservedQty: number;

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
    type: 'varchar',
    length: 30,
    default: StockReservationStatus.ACTIVE,
  })
  status: StockReservationStatus;

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
