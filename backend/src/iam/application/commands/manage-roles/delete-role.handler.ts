import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteRoleCommand } from './delete-role.command';
import { Inject } from '@nestjs/common';
import type { IRoleRepository } from '@/iam/domain/repositories/role.repository.interface';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: DeleteRoleCommand) {
    await this.roleRepository.delete(command.id);
  }
}
