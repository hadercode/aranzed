import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindPermissionsQuery } from './find-permissions.query';
import { Inject } from '@nestjs/common';
import type { IPermissionRepository } from '@/iam/domain/repositories/permission.repository.interface';

@QueryHandler(FindPermissionsQuery)
export class FindPermissionsHandler implements IQueryHandler<FindPermissionsQuery> {
  constructor(
    @Inject('IPermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(query: FindPermissionsQuery) {
    const permissions = await this.permissionRepository.findAll();
    return permissions.map((p) => ({
      id: p.id,
      action: p.action,
      resource: p.resource,
    }));
  }
}
