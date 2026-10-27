import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ProductOrmEntity } from '@/catalog/products/infrastructure/persistence/typeorm/entities/product.orm-entity';
import { RecipeOrmEntity } from './recipe.orm-entity';

@Entity('catalog_recipe_items')
export class RecipeItemOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index('IDX_catalog_recipe_items_recipe_id')
  @Column({ name: 'recipe_id', type: 'uuid' })
  recipeId: string;

  @ManyToOne(() => RecipeOrmEntity, (recipe) => recipe.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: RecipeOrmEntity;

  @Index('IDX_catalog_recipe_items_product_id')
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => ProductOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: ProductOrmEntity;

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

  @Column({
    name: 'subtotal_cost',
    type: 'numeric',
    precision: 14,
    scale: 4,
    default: 0.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  subtotalCost: number;

  @Column({ name: 'notes', type: 'varchar', length: 255, nullable: true })
  notes?: string | null;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;
}
