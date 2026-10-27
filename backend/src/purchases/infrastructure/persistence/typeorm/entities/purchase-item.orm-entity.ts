import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ProductOrmEntity } from '@/catalog/products/infrastructure/persistence/typeorm/entities/product.orm-entity';
import { PurchaseOrmEntity } from './purchase.orm-entity';

@Entity('material_purchase_items')
export class PurchaseItemOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_material_purchase_items_purchase_id')
  @Column({ name: 'purchase_id', type: 'uuid' })
  purchaseId: string;

  @ManyToOne(() => PurchaseOrmEntity, (purchase) => purchase.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseOrmEntity;

  @Index('IDX_material_purchase_items_material_id')
  @Column({ name: 'material_id', type: 'uuid' })
  materialId: string;

  @ManyToOne(() => ProductOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: ProductOrmEntity;

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string;

  @Column({
    name: 'quantity',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 1.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  quantity: number;

  // Bimoneda & Símbolos
  @Column({
    name: 'currency_symbol_functional',
    type: 'varchar',
    length: 5,
    default: '$',
  })
  currencySymbolFunctional: string;

  @Column({
    name: 'currency_symbol_local',
    type: 'varchar',
    length: 5,
    default: 'Bs.',
  })
  currencySymbolLocal: string;

  // Costo & Subtotal Funcional (USD)
  @Column({
    name: 'unit_cost',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  unitCost: number;

  @Column({ name: 'is_taxable', type: 'boolean', default: true })
  isTaxable: boolean;

  @Column({
    name: 'tax_rate',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 16.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  taxRate: number;

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

  // Costo & Subtotal Local (VES)
  @Column({
    name: 'unit_cost_local',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  unitCostLocal: number;

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

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @Column({
    name: 'batch_number',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  batchNumber?: string | null;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate?: Date | null;
}
