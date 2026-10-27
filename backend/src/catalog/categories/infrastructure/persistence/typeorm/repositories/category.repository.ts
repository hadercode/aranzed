import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { Category } from '@/catalog/categories/domain/entities/category.entity';
import { CategoryOrmEntity } from '../entities/category.orm-entity';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(CategoryOrmEntity)
    private readonly repository: Repository<CategoryOrmEntity>,
  ) {}

  async findById(id: string): Promise<Category | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const orm = await this.repository.findOne({ where: { name } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<Category[]> {
    const list = await this.repository.find({
      order: { name: 'ASC' },
    });
    return list.map((item) => this.toDomain(item));
  }

  async findByPathPrefix(pathPrefix: string): Promise<Category[]> {
    const list = await this.repository
      .createQueryBuilder('category')
      .where('category.path LIKE :prefix', { prefix: `${pathPrefix}%` })
      .getMany();
    return list.map((item) => this.toDomain(item));
  }

  async save(category: Category): Promise<Category> {
    const orm = this.toOrm(category);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  private toDomain(orm: CategoryOrmEntity): Category {
    const category = new Category({
      id: orm.id,
      name: orm.name,
      parentId: orm.parentId ?? undefined,
      path: orm.path ?? '',
      isActive: orm.isActive,
      createdById: orm.createdById ?? undefined,
      deletedAt: orm.deletedAt ?? undefined,
    });
    category.createdAt = orm.createdAt;
    category.updatedAt = orm.updatedAt;
    return category;
  }

  private toOrm(domain: Category): CategoryOrmEntity {
    const orm = new CategoryOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.parentId = domain.parentId ?? null;
    orm.path = domain.path || null;
    orm.isActive = domain.isActive;
    orm.createdById = domain.createdById ?? null;
    return orm;
  }
}
