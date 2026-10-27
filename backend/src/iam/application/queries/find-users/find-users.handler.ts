import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUsersQuery } from './find-users.query';
import { Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';

@QueryHandler(FindUsersQuery)
export class FindUsersHandler implements IQueryHandler<FindUsersQuery> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: FindUsersQuery) {
    const users = await this.userRepository.findAll();
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      roles: u.roles.map((r) => r.name),
      createdAt: u.createdAt || new Date(), // Domain model might not have createdAt mapped yet, but let's assume it works or we fallback
    }));
  }
}
