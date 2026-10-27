import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordCommand } from './change-password.command';
import { Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { IHashingService } from '../../ports/hashing.service.interface';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IHashingService')
    private readonly hashingService: IHashingService,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<{ message: string }> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!command.currentPassword || !command.newPassword) {
      throw new BadRequestException(
        'Debes proporcionar la contraseña actual y la nueva contraseña',
      );
    }

    const isMatch = await this.hashingService.compare(
      command.currentPassword,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    if (command.newPassword.length < 6) {
      throw new BadRequestException(
        'La nueva contraseña debe tener al menos 6 caracteres',
      );
    }

    if (command.currentPassword === command.newPassword) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la actual',
      );
    }

    user.passwordHash = await this.hashingService.hash(command.newPassword);
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada con éxito' };
  }
}
