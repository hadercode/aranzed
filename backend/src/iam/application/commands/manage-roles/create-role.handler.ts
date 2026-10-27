import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from './create-role.command';
import { Inject, ConflictException } from '@nestjs/common';
import type { IRoleRepository } from '@/iam/domain/repositories/role.repository.interface';
import { Role } from '@/iam/domain/entities/role.entity';
import { randomUUID } from 'crypto';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
  ) {}

  async execute(command: CreateRoleCommand) {
    const existing = await this.roleRepository.findByName(command.name);
    if (existing) {
      throw new ConflictException('Role already exists');
    }

    const role = new Role(randomUUID(), command.name, command.description, []);

    await this.roleRepository.save(role);

    return { id: role.id };
  }
}
