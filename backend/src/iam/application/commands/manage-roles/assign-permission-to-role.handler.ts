import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { AssignPermissionToRoleCommand } from './assign-permission-to-role.command';
import type { IRoleRepository } from '@/iam/domain/repositories/role.repository.interface';
import type { IPermissionRepository } from '@/iam/domain/repositories/permission.repository.interface';

@CommandHandler(AssignPermissionToRoleCommand)
export class AssignPermissionToRoleHandler implements ICommandHandler<AssignPermissionToRoleCommand> {
  constructor(
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    @Inject('IPermissionRepository')
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(command: AssignPermissionToRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${command.roleId} not found`);
    }

    const permission = await this.permissionRepository.findById(
      command.permissionId,
    );
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID ${command.permissionId} not found`,
      );
    }

    role.assignPermission(permission);
    await this.roleRepository.save(role);
  }
}
