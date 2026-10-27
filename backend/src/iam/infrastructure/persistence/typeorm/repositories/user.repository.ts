import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../../../domain/repositories/user.repository.interface';
import { User } from '../../../../domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { RoleOrmEntity } from '../entities/role.orm-entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const ormEntity = new UserOrmEntity();
    ormEntity.id = user.id;
    ormEntity.email = user.email;
    ormEntity.passwordHash = user.passwordHash;
    ormEntity.passwordRecoveryToken = user.passwordRecoveryToken || null;
    ormEntity.firstName = user.firstName || null;
    ormEntity.lastName = user.lastName || null;
    ormEntity.phone = user.phone || null;
    ormEntity.avatarUrl = user.avatarUrl || null;
    ormEntity.jobTitle = user.jobTitle || null;
    ormEntity.bio = user.bio || null;

    // Map roles
    if (user.roles && user.roles.length > 0) {
      ormEntity.roles = user.roles.map((r) => {
        const roleOrm = new RoleOrmEntity();
        roleOrm.id = r.id;
        roleOrm.name = r.name;
        roleOrm.description = r.description;
        return roleOrm;
      });
    }

    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<User | null> {
    const ormEntity = await this.repository.findOne({
      where: { id },
      relations: { roles: true, directPermissions: true },
    });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const ormEntity = await this.repository.findOne({
      where: { email },
      relations: {
        roles: {
          permissions: true,
        },
        directPermissions: true,
      },
    });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async findByRecoveryToken(token: string): Promise<User | null> {
    const ormEntity = await this.repository.findOne({
      where: { passwordRecoveryToken: token },
    });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async findAll(): Promise<User[]> {
    const ormEntities = await this.repository.find({
      relations: { roles: true },
      order: { createdAt: 'DESC' },
    });
    return ormEntities.map((e) => this.toDomain(e));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(ormEntity: UserOrmEntity): User {
    const { Role } = require('../../../../domain/entities/role.entity');
    const {
      Permission,
    } = require('../../../../domain/entities/permission.entity');

    const roles = (ormEntity.roles || []).map(
      (r) =>
        new Role(
          r.id,
          r.name,
          r.description,
          (r.permissions || []).map(
            (p) => new Permission(p.id, p.action, p.resource),
          ),
        ),
    );

    const user = new User(
      ormEntity.id,
      ormEntity.email,
      ormEntity.passwordHash,
      roles,
      [], // map direct permissions here
      ormEntity.passwordRecoveryToken || undefined,
      ormEntity.firstName || undefined,
      ormEntity.lastName || undefined,
      ormEntity.phone || undefined,
      ormEntity.avatarUrl || undefined,
      ormEntity.jobTitle || undefined,
      ormEntity.bio || undefined,
    );
    user.createdAt = ormEntity.createdAt;
    user.updatedAt = ormEntity.updatedAt;
    return user;
  }
}
