import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import type { IHashingService } from '../../ports/hashing.service.interface';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
  ) {}

  async execute(command: UpdateUserCommand) {
    const user = await this.userRepository.findById(command.id);
    if (!user) {
      throw new Error('User not found');
    }

    if (command.email) {
      user.email = command.email;
    }

    if (command.password) {
      user.passwordHash = await this.hashingService.hash(command.password);
    }

    if (command.roles) {
      const roles = command.roles.length
        ? await this.roleRepository.findByNames(command.roles)
        : [];
      user.roles = roles;
    }

    await this.userRepository.save(user);
  }
}
