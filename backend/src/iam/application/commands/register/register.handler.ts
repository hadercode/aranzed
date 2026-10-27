import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { Inject, ConflictException } from '@nestjs/common';
import type { IUserRepository } from '@/iam/domain/repositories/user.repository.interface';
import type { IHashingService } from '@/iam/application/ports/hashing.service.interface';
import { User } from '@/iam/domain/entities/user.entity';
import { randomUUID } from 'crypto';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
  ) {}

  async execute(command: RegisterCommand): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashingService.hash(command.password);
    const user = new User(randomUUID(), command.email, hashedPassword);

    await this.userRepository.save(user);
  }
}
