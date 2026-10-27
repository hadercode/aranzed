import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { IRoleRepository } from '../../../../domain/repositories/role.repository.interface';
import { Role } from '../../../../domain/entities/role.entity';
import { Permission } from '../../../../domain/entities/permission.entity';
import { RoleOrmEntity } from '../entities/role.orm-entity';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly repository: Repository<RoleOrmEntity>,
  ) {}

  async save(role: Role): Promise<void> {
    const ormEntity = new RoleOrmEntity();
    ormEntity.id = role.id;
    ormEntity.name = role.name;
    ormEntity.description = role.description;

    if (role.permissions) {
      ormEntity.permissions = role.permissions.map((p) => {
        const permOrm = new PermissionOrmEntity();
        permOrm.id = p.id;
        return permOrm;
      });
    }

    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<Role | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
      relations: { permissions: true },
    });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async findByName(name: string): Promise<Role | null> {
    const ormEntity = await this.repository.findOne({
      where: { name },
      relations: { permissions: true },
    });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async findByNames(names: string[]): Promise<Role[]> {
    if (!names || names.length === 0) return [];
    const ormEntities = await this.repository.find({
      where: { name: In(names) },
      relations: { permissions: true },
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async findAll(): Promise<Role[]> {
    const ormEntities = await this.repository.find({
      order: { name: 'ASC' },
      relations: { permissions: true },
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(ormEntity: RoleOrmEntity): Role {
    const permissions = (ormEntity.permissions || []).map(
      (p) => new Permission(p.id, p.action, p.resource),
    );
    const role = new Role(
      ormEntity.id,
      ormEntity.name,
      ormEntity.description,
      permissions,
    );
    role.createdAt = ormEntity.createdAt;
    role.updatedAt = ormEntity.updatedAt;
    return role;
  }
}
