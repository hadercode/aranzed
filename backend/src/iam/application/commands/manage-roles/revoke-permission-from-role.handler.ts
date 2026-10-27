import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { RevokePermissionFromRoleCommand } from './revoke-permission-from-role.command';
import type { IRoleRepository } from '@/iam/domain/repositories/role.repository.interface';

@CommandHandler(RevokePermissionFromRoleCommand)
export class RevokePermissionFromRoleHandler implements ICommandHandler<RevokePermissionFromRoleCommand> {
  constructor(
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: RevokePermissionFromRoleCommand): Promise<void> {
    const role = await this.roleRepository.findById(command.roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID ${command.roleId} not found`);
    }

    role.revokePermission(command.permissionId);
    await this.roleRepository.save(role);
  }
}
