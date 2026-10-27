import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from './get-profile.query';
import { Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: GetProfileQuery) {
    const user = await this.userRepository.findById(query.userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
