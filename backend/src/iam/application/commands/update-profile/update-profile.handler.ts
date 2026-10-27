import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from './update-profile.command';
import { Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateProfileCommand) {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (command.data.firstName !== undefined) {
      user.firstName = command.data.firstName;
    }
    if (command.data.lastName !== undefined) {
      user.lastName = command.data.lastName;
    }
    if (command.data.phone !== undefined) {
      user.phone = command.data.phone;
    }
    if (command.data.avatarUrl !== undefined) {
      user.avatarUrl = command.data.avatarUrl || undefined;
    }
    if (command.data.jobTitle !== undefined) {
      user.jobTitle = command.data.jobTitle;
    }
    if (command.data.bio !== undefined) {
      user.bio = command.data.bio;
    }

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      avatarUrl: user.avatarUrl || null,
      jobTitle: user.jobTitle || '',
      bio: user.bio || '',
      roles: user.roles ? user.roles.map((r) => r.name) : [],
      permissions: user.getAllPermissions(),
      updatedAt: user.updatedAt,
    };
  }
}
