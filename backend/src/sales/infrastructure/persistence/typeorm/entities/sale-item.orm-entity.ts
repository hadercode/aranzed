import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { SaleOrmEntity } from './sale.orm-entity';
import { ProductOrmEntity } from '@/catalog/products/infrastructure/persistence/typeorm/entities/product.orm-entity';

@Entity('sale_items')
export class SaleItemOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_sale_items_sale_id')
  @Column({ name: 'sale_id', type: 'uuid' })
  saleId: string;

  @Index('IDX_sale_items_product_id')
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({
    name: 'product_type',
    type: 'varchar',
    length: 30,
    default: 'TRADITIONAL',
  })
  productType: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 1.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  unitPrice: number;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  unitCost: number;

  @Column({
    name: 'discount_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  discountRate: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  discountAmount: number;

  @Column({ name: 'is_taxable', type: 'boolean', default: true })
  isTaxable: boolean;

  @Column({
    name: 'tax_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 16.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  taxRate: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  taxAmount: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  subtotal: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  total: number;

  // Bimoneda Local
  @Column({
    name: 'unit_price_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  unitPriceLocal: number;

  @Column({
    name: 'subtotal_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  subtotalLocal: number;

  @Column({
    name: 'discount_amount_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  discountAmountLocal: number;

  @Column({
    name: 'tax_amount_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  taxAmountLocal: number;

  @Column({
    name: 'total_local',
    type: 'decimal',
    precision: 14,
    scale: 4,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  totalLocal: number;

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

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => SaleOrmEntity, (sale) => sale.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sale_id' })
  sale: SaleOrmEntity;

  @ManyToOne(() => ProductOrmEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;
}
