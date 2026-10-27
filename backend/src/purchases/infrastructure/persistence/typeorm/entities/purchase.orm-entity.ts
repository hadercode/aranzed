import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PurchaseStatus } from '@/purchases/domain/enums/purchase-status.enum';
import { PurchaseItemOrmEntity } from './purchase-item.orm-entity';

@Entity('material_purchases')
export class PurchaseOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_material_purchases_number', { unique: true })
  @Column({
    name: 'purchase_number',
    type: 'varchar',
    length: 30,
    unique: true,
  })
  purchaseNumber: string;

  @Index('IDX_material_purchases_supplier')
  @Column({ name: 'supplier_name', type: 'varchar', length: 150 })
  supplierName: string;

  @Column({ name: 'purchase_date', type: 'timestamp' })
  purchaseDate: Date;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Index('IDX_material_purchases_status')
  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: PurchaseStatus.DRAFT,
  })
  status: PurchaseStatus;

  @Index('IDX_material_purchases_invoice')
  @Column({ name: 'invoice_number', type: 'varchar', length: 50 })
  invoiceNumber: string;

  @Column({ name: 'warehouse_id', type: 'uuid', nullable: true })
  warehouseId?: string | null;

  // Bimoneda & Tasa de Cambio
  @Column({
    name: 'exchange_rate',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 1.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  exchangeRate: number;

  @Column({
    name: 'functional_currency',
    type: 'varchar',
    length: 10,
    default: 'USD',
  })
  functionalCurrency: string;

  @Column({
    name: 'local_currency',
    type: 'varchar',
    length: 10,
    default: 'VES',
  })
  localCurrency: string;

  @Column({
    name: 'document_currency',
    type: 'varchar',
    length: 10,
    default: 'USD',
  })
  documentCurrency: string;

  // Totales Moneda Funcional (USD)
  @Column({
    name: 'subtotal',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  subtotal: number;

  @Column({
    name: 'tax_amount',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  taxAmount: number;

  @Column({
    name: 'total',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total: number;

  // Totales Moneda Local (VES)
  @Column({
    name: 'subtotal_local',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  subtotalLocal: number;

  @Column({
    name: 'tax_amount_local',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  taxAmountLocal: number;

  @Column({
    name: 'total_local',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalLocal: number;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => PurchaseItemOrmEntity, (item) => item.purchase, {
    cascade: true,
  })
  items: PurchaseItemOrmEntity[];
}
