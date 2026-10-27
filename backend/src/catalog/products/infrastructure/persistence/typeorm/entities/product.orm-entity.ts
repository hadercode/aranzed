import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UnitOfMeasureOrmEntity } from '@/catalog/units-of-measure/infrastructure/persistence/typeorm/entities/unit-of-measure.orm-entity';
import { CategoryOrmEntity } from '@/catalog/categories/infrastructure/persistence/typeorm/entities/category.orm-entity';
import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';

@Entity('catalog_products')
export class ProductOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_catalog_products_name')
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl: string | null;

  @Index('IDX_catalog_products_type')
  @Column({
    type: 'varchar',
    length: 30,
    enum: ProductType,
    default: ProductType.TRADITIONAL,
  })
  type: ProductType;

  @Index('IDX_catalog_products_uom_id')
  @Column({ name: 'uom_id', type: 'uuid' })
  uomId: string;

  @Index('IDX_catalog_products_category_id')
  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({
    name: 'profit_margin',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string | number) =>
        value !== null && value !== undefined ? parseFloat(String(value)) : 0,
    },
  })
  profitMargin: number;

  @Column({
    name: 'last_cost',
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
  lastCost: number;

  @Column({
    name: 'last_sale_price',
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
  lastSalePrice: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'manage_inventory', type: 'boolean', default: true })
  manageInventory: boolean;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;

  @ManyToOne(() => UnitOfMeasureOrmEntity, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'uom_id' })
  uom?: UnitOfMeasureOrmEntity;

  @ManyToOne(() => CategoryOrmEntity, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category?: CategoryOrmEntity | null;
}
