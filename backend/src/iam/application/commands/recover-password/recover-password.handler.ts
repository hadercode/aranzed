import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecoverPasswordCommand } from './recover-password.command';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { IEmailService } from '../../../application/ports/email.service.interface';
import { randomBytes } from 'crypto';

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordHandler implements ICommandHandler<RecoverPasswordCommand> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IEmailService') private readonly emailService: IEmailService,
  ) {}

  async execute(command: RecoverPasswordCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      // Do not throw error to avoid email enumeration
      return;
    }

    const token = randomBytes(32).toString('hex');
    user.passwordRecoveryToken = token;
    await this.userRepository.save(user);

    await this.emailService.sendPasswordRecoveryEmail(user.email, token);
  }
}
