import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Recipe } from '@/catalog/recipes/domain/entities/recipe.entity';
import { RecipeItem } from '@/catalog/recipes/domain/entities/recipe-item.entity';
import {
  IRecipeRepository,
  FindRecipesFilters,
} from '@/catalog/recipes/domain/repositories/recipe.repository.interface';
import { RecipeOrmEntity } from '../entities/recipe.orm-entity';
import { RecipeItemOrmEntity } from '../entities/recipe-item.orm-entity';

@Injectable()
export class TypeOrmRecipeRepository implements IRecipeRepository {
  constructor(
    @InjectRepository(RecipeOrmEntity)
    private readonly recipeRepo: Repository<RecipeOrmEntity>,
    @InjectRepository(RecipeItemOrmEntity)
    private readonly recipeItemRepo: Repository<RecipeItemOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private toDomain(orm: RecipeOrmEntity): Recipe {
    const items = (orm.items || []).map(
      (itemOrm) =>
        new RecipeItem({
          id: itemOrm.id,
          recipeId: itemOrm.recipeId,
          productId: itemOrm.productId,
          quantity: Number(itemOrm.quantity),
          unitCost: Number(itemOrm.unitCost),
          subtotalCost: Number(itemOrm.subtotalCost),
          notes: itemOrm.notes,
          sortOrder: itemOrm.sortOrder,
          product: itemOrm.product
            ? {
                id: itemOrm.product.id,
                name: itemOrm.product.name,
                type: itemOrm.product.type,
                uomCode: itemOrm.product.uom?.code,
                uomName: itemOrm.product.uom?.name,
                lastCost: Number(itemOrm.product.lastCost),
              }
            : null,
        }),
    );

    return new Recipe({
      id: orm.id,
      code: orm.code,
      name: orm.name,
      description: orm.description,
      productId: orm.productId,
      status: orm.status,
      yieldQuantity: Number(orm.yieldQuantity),
      totalCost: Number(orm.totalCost),
      createdById: orm.createdById,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
      deletedAt: orm.deletedAt,
      items,
      product: orm.product
        ? {
            id: orm.product.id,
            name: orm.product.name,
            type: orm.product.type,
            uomCode: orm.product.uom?.code,
            uomName: orm.product.uom?.name,
            lastCost: Number(orm.product.lastCost),
            lastSalePrice: Number(orm.product.lastSalePrice),
          }
        : null,
    });
  }

  async findAll(
    filters?: FindRecipesFilters,
  ): Promise<{ recipes: Recipe[]; total: number }> {
    const qb = this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.product', 'product')
      .leftJoinAndSelect('product.uom', 'productUom')
      .leftJoinAndSelect('recipe.items', 'item')
      .leftJoinAndSelect('item.product', 'itemProduct')
      .leftJoinAndSelect('itemProduct.uom', 'itemProductUom')
      .orderBy('recipe.createdAt', 'DESC')
      .addOrderBy('item.sortOrder', 'ASC');

    if (filters?.search) {
      const term = `%${filters.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(recipe.name) LIKE :term OR LOWER(recipe.code) LIKE :term OR LOWER(product.name) LIKE :term)',
        { term },
      );
    }

    if (filters?.productId) {
      qb.andWhere('recipe.productId = :productId', {
        productId: filters.productId,
      });
    }

    if (filters?.status) {
      qb.andWhere('recipe.status = :status', { status: filters.status });
    }

    if (filters?.limit) {
      qb.take(filters.limit);
    }
    if (filters?.offset) {
      qb.skip(filters.offset);
    }

    const [orms, total] = await qb.getManyAndCount();
    return {
      recipes: orms.map((o) => this.toDomain(o)),
      total,
    };
  }

  async findById(id: string): Promise<Recipe | null> {
    const orm = await this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.product', 'product')
      .leftJoinAndSelect('product.uom', 'productUom')
      .leftJoinAndSelect('recipe.items', 'item')
      .leftJoinAndSelect('item.product', 'itemProduct')
      .leftJoinAndSelect('itemProduct.uom', 'itemProductUom')
      .where('recipe.id = :id', { id })
      .orderBy('item.sortOrder', 'ASC')
      .getOne();

    return orm ? this.toDomain(orm) : null;
  }

  async findByCode(code: string): Promise<Recipe | null> {
    const orm = await this.recipeRepo.findOne({
      where: { code },
      relations: {
        product: true,
        items: {
          product: true,
        },
      },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByProductId(productId: string): Promise<Recipe[]> {
    const orms = await this.recipeRepo.find({
      where: { productId },
      relations: {
        product: true,
        items: {
          product: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
    return orms.map((o) => this.toDomain(o));
  }

  async save(recipe: Recipe): Promise<Recipe> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Save or update Recipe header
      const recipeOrm = queryRunner.manager.create(RecipeOrmEntity, {
        id: recipe.id,
        code: recipe.code,
        name: recipe.name,
        description: recipe.description,
        productId: recipe.productId,
        status: recipe.status,
        yieldQuantity: recipe.yieldQuantity,
        totalCost: recipe.totalCost,
        createdById:
          typeof recipe.createdById === 'string' ? recipe.createdById : null,
      });

      await queryRunner.manager.save(RecipeOrmEntity, recipeOrm);

      // 2. Synchronize items: remove old ones for this recipe and insert new ones
      await queryRunner.manager.delete(RecipeItemOrmEntity, {
        recipeId: recipe.id,
      });

      if (recipe.items && recipe.items.length > 0) {
        const itemOrms = recipe.items.map((item, index) =>
          queryRunner.manager.create(RecipeItemOrmEntity, {
            id: item.id,
            recipeId: recipe.id,
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            subtotalCost: item.subtotalCost,
            notes: item.notes,
            sortOrder: item.sortOrder || index,
          }),
        );
        await queryRunner.manager.save(RecipeItemOrmEntity, itemOrms);
      }

      await queryRunner.commitTransaction();

      const saved = await this.findById(recipe.id);
      return saved || recipe;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<void> {
    await this.recipeRepo.softDelete(id);
  }

  async getNextSequenceCode(): Promise<string> {
    const count = await this.recipeRepo.count({ withDeleted: true });
    const seq = (count + 1).toString().padStart(4, '0');
    return `BOM-${seq}`;
  }
}
