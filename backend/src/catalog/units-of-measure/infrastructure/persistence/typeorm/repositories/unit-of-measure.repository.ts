import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UnitOfMeasure } from '@/catalog/units-of-measure/domain/entities/unit-of-measure.entity';
import { UnitOfMeasureOrmEntity } from '../entities/unit-of-measure.orm-entity';

@Injectable()
export class UnitOfMeasureRepository implements IUnitOfMeasureRepository {
  constructor(
    @InjectRepository(UnitOfMeasureOrmEntity)
    private readonly repository: Repository<UnitOfMeasureOrmEntity>,
  ) {}

  async findById(id: string): Promise<UnitOfMeasure | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByCode(code: string): Promise<UnitOfMeasure | null> {
    const orm = await this.repository.findOne({
      where: { code: code.toUpperCase().trim() },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(): Promise<UnitOfMeasure[]> {
    const list = await this.repository.find({
      order: { code: 'ASC' },
    });
    return list.map((item) => this.toDomain(item));
  }

  async save(unitOfMeasure: UnitOfMeasure): Promise<UnitOfMeasure> {
    const orm = this.toOrm(unitOfMeasure);
    const saved = await this.repository.save(orm);
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  private toDomain(orm: UnitOfMeasureOrmEntity): UnitOfMeasure {
    const entity = new UnitOfMeasure({
      id: orm.id,
      code: orm.code,
      name: orm.name,
      isActive: orm.isActive,
      allowDecimals: orm.allowDecimals,
      createdById: orm.createdById ?? undefined,
      deletedAt: orm.deletedAt ?? undefined,
    });
    entity.createdAt = orm.createdAt;
    entity.updatedAt = orm.updatedAt;
    return entity;
  }

  private toOrm(domain: UnitOfMeasure): UnitOfMeasureOrmEntity {
    const orm = new UnitOfMeasureOrmEntity();
    orm.id = domain.id;
    orm.code = domain.code.toUpperCase().trim();
    orm.name = domain.name.trim();
    orm.isActive = domain.isActive;
    orm.allowDecimals = domain.allowDecimals;
    orm.createdById = domain.createdById ?? null;
    return orm;
  }
}
