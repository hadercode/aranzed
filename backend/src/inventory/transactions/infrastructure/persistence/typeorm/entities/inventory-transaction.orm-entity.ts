import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { InventoryTransactionType } from '@/inventory/transactions/domain/enums/inventory-transaction-type.enum';
import { InventoryTransactionStatus } from '@/inventory/transactions/domain/enums/inventory-transaction-status.enum';
import { WarehouseOrmEntity } from '@/inventory/warehouses/infrastructure/persistence/typeorm/entities/warehouse.orm-entity';
import { InventoryReasonOrmEntity } from '@/inventory/reasons/infrastructure/persistence/typeorm/entities/inventory-reason.orm-entity';
import { InventoryTransactionItemOrmEntity } from './inventory-transaction-item.orm-entity';

@Entity('inventory_transactions')
@Unique(['transactionNumber'])
export class InventoryTransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId?: string | null;

  @Column({ name: 'company_id', type: 'uuid', nullable: true })
  companyId?: string | null;

  @Column({
    name: 'transaction_number',
    type: 'varchar',
    length: 50,
  })
  transactionNumber: string;

  @Column({ type: 'varchar', length: 30 })
  type: InventoryTransactionType;

  @Column({ name: 'reason_id', type: 'uuid', nullable: true })
  reasonId?: string | null;

  @ManyToOne(() => InventoryReasonOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reason_id' })
  reason?: InventoryReasonOrmEntity | null;

  @Column({ name: 'origin_warehouse_id', type: 'uuid', nullable: true })
  originWarehouseId?: string | null;

  @ManyToOne(() => WarehouseOrmEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'origin_warehouse_id' })
  originWarehouse?: WarehouseOrmEntity | null;

  @Column({ name: 'dest_warehouse_id', type: 'uuid', nullable: true })
  destWarehouseId?: string | null;

  @ManyToOne(() => WarehouseOrmEntity, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'dest_warehouse_id' })
  destWarehouse?: WarehouseOrmEntity | null;

  @Column({
    type: 'varchar',
    length: 30,
    default: InventoryTransactionStatus.DRAFT,
  })
  status: InventoryTransactionStatus;

  @Column({
    name: 'movement_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
  })
  movementDate: Date;

  @Column({
    name: 'reference_entity_type',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  referenceEntityType?: string | null;

  @Column({ name: 'reference_entity_id', type: 'uuid', nullable: true })
  referenceEntityId?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ name: 'documents', type: 'jsonb', nullable: true })
  documents?: string[] | null;

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

  @OneToMany(
    () => InventoryTransactionItemOrmEntity,
    (item: InventoryTransactionItemOrmEntity) => item.transaction,
    { cascade: true, eager: true },
  )
  items: InventoryTransactionItemOrmEntity[];
}
