import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';
import { IPermissionRepository } from '../../../../domain/repositories/permission.repository.interface';
import { Permission } from '../../../../domain/entities/permission.entity';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly ormRepository: Repository<PermissionOrmEntity>,
  ) {}

  async save(permission: Permission): Promise<void> {
    const ormEntity = this.toOrmEntity(permission);
    await this.ormRepository.save(ormEntity);
  }

  async findById(id: string): Promise<Permission | null> {
    const ormEntity = await this.ormRepository.findOne({ where: { id } });
    if (!ormEntity) return null;
    return this.toDomainEntity(ormEntity);
  }

  async findByActionAndResource(
    action: string,
    resource: string,
  ): Promise<Permission | null> {
    const ormEntity = await this.ormRepository.findOne({
      where: { action, resource },
    });
    if (!ormEntity) return null;
    return this.toDomainEntity(ormEntity);
  }

  async findAll(): Promise<Permission[]> {
    const ormEntities = await this.ormRepository.find();
    return ormEntities.map((orm) => this.toDomainEntity(orm));
  }

  private toDomainEntity(ormEntity: PermissionOrmEntity): Permission {
    return new Permission(ormEntity.id, ormEntity.action, ormEntity.resource);
  }

  private toOrmEntity(domainEntity: Permission): PermissionOrmEntity {
    const ormEntity = new PermissionOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.action = domainEntity.action;
    ormEntity.resource = domainEntity.resource;
    return ormEntity;
  }
}
