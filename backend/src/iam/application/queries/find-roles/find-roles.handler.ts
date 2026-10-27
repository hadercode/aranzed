import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindRolesQuery } from './find-roles.query';
import { Inject } from '@nestjs/common';
import type { IRoleRepository } from '@/iam/domain/repositories/role.repository.interface';

@QueryHandler(FindRolesQuery)
export class FindRolesHandler implements IQueryHandler<FindRolesQuery> {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(query: FindRolesQuery) {
    const roles = await this.roleRepository.findAll();
    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      permissions: r.permissions.map((p) => ({
        id: p.id,
        action: p.action,
        resource: p.resource,
      })),
      createdAt: r.createdAt || new Date(),
    }));
  }
}
