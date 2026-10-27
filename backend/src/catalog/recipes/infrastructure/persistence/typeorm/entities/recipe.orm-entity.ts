import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ProductOrmEntity } from '@/catalog/products/infrastructure/persistence/typeorm/entities/product.orm-entity';
import { RecipeStatus } from '@/catalog/recipes/domain/enums/recipe-status.enum';
import { RecipeItemOrmEntity } from './recipe-item.orm-entity';

@Entity('catalog_recipes')
export class RecipeOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_catalog_recipes_code', { unique: true })
  @Column({ name: 'code', type: 'varchar', length: 30, unique: true })
  code: string;

  @Column({ name: 'name', type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Index('IDX_catalog_recipes_product_id')
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

  @Index('IDX_catalog_recipes_status')
  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: RecipeStatus.DRAFT,
  })
  status: RecipeStatus;

  @Column({
    name: 'yield_quantity',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 1.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  yieldQuantity: number;

  @Column({
    name: 'total_cost',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalCost: number;

  @Column({ name: 'created_by_id', type: 'uuid', nullable: true })
  createdById?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => RecipeItemOrmEntity, (item) => item.recipe, {
    cascade: true,
  })
  items: RecipeItemOrmEntity[];
}
