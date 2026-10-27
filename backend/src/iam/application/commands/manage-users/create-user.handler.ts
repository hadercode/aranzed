import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { IRoleRepository } from '../../../domain/repositories/role.repository.interface';
import type { IHashingService } from '../../ports/hashing.service.interface';
import { User } from '../../../domain/entities/user.entity';
import { randomUUID } from 'crypto';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IRoleRepository') private readonly roleRepository: IRoleRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
  ) {}

  async execute(command: CreateUserCommand) {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new Error('Email is already registered');
    }

    const passwordHash = await this.hashingService.hash(
      command.password || '123456',
    );
    const roles = command.roles?.length
      ? await this.roleRepository.findByNames(command.roles)
      : [];

    const user = new User(randomUUID(), command.email, passwordHash, roles);

    await this.userRepository.save(user);

    return { id: user.id };
  }
}
