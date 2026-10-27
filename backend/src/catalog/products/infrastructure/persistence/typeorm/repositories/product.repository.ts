import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IProductRepository,
  ProductFilters,
} from '@/catalog/products/domain/repositories/product.repository.interface';
import { Product } from '@/catalog/products/domain/entities/product.entity';
import { ProductType } from '@/catalog/products/domain/enums/product-type.enum';
import { ProductOrmEntity } from '../entities/product.orm-entity';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findById(id: string): Promise<Product | null> {
    const orm = await this.repository.findOne({
      where: { id },
      relations: { uom: true, category: true },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const orm = await this.repository.findOne({
      where: { name: name.trim() },
      relations: { uom: true, category: true },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const qb = this.repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.uom', 'uom')
      .leftJoinAndSelect('p.category', 'category');

    if (filters?.type) {
      qb.andWhere('p.type = :type', { type: filters.type });
    }

    if (filters?.categoryId) {
      qb.andWhere('p.categoryId = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters?.uomId) {
      qb.andWhere('p.uomId = :uomId', { uomId: filters.uomId });
    }

    if (filters?.isActive !== undefined) {
      qb.andWhere('p.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const term = `%${filters.search.trim().toLowerCase()}%`;
      qb.andWhere(
        "(LOWER(p.name) LIKE :term OR LOWER(COALESCE(p.description, '')) LIKE :term)",
        { term },
      );
    }

    qb.orderBy('p.name', 'ASC');

    const list = await qb.getMany();
    return list.map((item) => this.toDomain(item));
  }

  async save(product: Product): Promise<Product> {
    const orm = this.toOrm(product);
    await this.repository.save(orm);
    const refreshed = await this.findById(product.id);
    return refreshed || product;
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  private toDomain(orm: ProductOrmEntity): Product {
    const entity = new Product({
      id: orm.id,
      name: orm.name,
      description: orm.description,
      imageUrl: orm.imageUrl,
      type: orm.type,
      uomId: orm.uomId,
      categoryId: orm.categoryId,
      profitMargin: orm.profitMargin,
      lastCost: orm.lastCost,
      lastSalePrice: orm.lastSalePrice,
      isActive: orm.isActive,
      manageInventory:
        orm.manageInventory !== undefined
          ? orm.manageInventory
          : orm.type !== ProductType.SERVICE,
      createdById: orm.createdById ?? undefined,
      deletedAt: orm.deletedAt ?? undefined,
      uom: orm.uom
        ? {
            id: orm.uom.id,
            code: orm.uom.code,
            name: orm.uom.name,
          }
        : null,
      category: orm.category
        ? {
            id: orm.category.id,
            name: orm.category.name,
          }
        : null,
    });
    entity.createdAt = orm.createdAt;
    entity.updatedAt = orm.updatedAt;
    return entity;
  }

  private toOrm(domain: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name.trim();
    orm.description = domain.description?.trim() || null;
    orm.imageUrl = domain.imageUrl?.trim() || null;
    orm.type = domain.type;
    orm.uomId = domain.uomId;
    orm.categoryId = domain.categoryId || null;
    orm.profitMargin = Number(domain.profitMargin) || 0;
    orm.lastCost = Number(domain.lastCost) || 0;
    orm.lastSalePrice = Number(domain.lastSalePrice) || 0;
    orm.isActive = domain.isActive;
    orm.manageInventory =
      domain.manageInventory !== undefined
        ? domain.manageInventory
        : domain.type !== ProductType.SERVICE;
    orm.createdById = domain.createdById ?? null;
    return orm;
  }
}
