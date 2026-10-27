import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRoleCommand } from './update-role.command';
import { Inject, NotFoundException } from '@nestjs/common';
import type { IRoleRepository } from '@/iam/domain/repositories/role.repository.interface';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: UpdateRoleCommand) {
    const role = await this.roleRepository.findById(command.id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (command.name) {
      role.name = command.name;
    }

    if (command.description) {
      role.description = command.description;
    }

    await this.roleRepository.save(role);
  }
}
