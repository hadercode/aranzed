import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import type { IHashingService } from '../../../application/ports/hashing.service.interface';
import type { IJwtService } from '../../../application/ports/jwt.service.interface';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
    @Inject('IJwtService') private readonly jwtService: IJwtService,
  ) {}

  async execute(command: LoginCommand): Promise<{ user: any; token: string }> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this.hashingService.compare(
      command.password,
      user.passwordHash,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const permissions = user.getAllPermissions();
    const payload = {
      sub: user.id,
      email: user.email,
      permissions,
      expiresIn: '1d',
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        jobTitle: user.jobTitle,
        bio: user.bio,
        roles: user.roles.map((r: any) => r.name),
        permissions: permissions,
      },
      token: accessToken,
    };
  }
}
