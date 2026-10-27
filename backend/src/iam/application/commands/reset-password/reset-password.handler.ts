import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResetPasswordCommand } from './reset-password.command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { IHashingService } from '../../../application/ports/hashing.service.interface';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const user = await this.userRepository.findByRecoveryToken(command.token);
    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    user.passwordHash = await this.hashingService.hash(command.newPassword);
    user.passwordRecoveryToken = undefined;

    await this.userRepository.save(user);
  }
}
