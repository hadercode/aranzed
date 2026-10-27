import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './presentation/http/controllers/auth.controller';
import { UserController } from './presentation/http/controllers/user.controller';
import { RegisterHandler } from './application/commands/register/register.handler';
import { LoginHandler } from './application/commands/login/login.handler';
import { RecoverPasswordHandler } from './application/commands/recover-password/recover-password.handler';

import { BcryptService } from './infrastructure/security/bcrypt.service';
import { AppJwtService } from './infrastructure/security/jwt.service';
import { JwtStrategy } from './infrastructure/security/jwt.strategy';
import { DummyEmailService } from './infrastructure/external/dummy-email.service';
import { UserRepository } from './infrastructure/persistence/typeorm/repositories/user.repository';
import { RoleRepository } from './infrastructure/persistence/typeorm/repositories/role.repository';
import { PermissionRepository } from './infrastructure/persistence/typeorm/repositories/permission.repository';

import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from './infrastructure/persistence/typeorm/entities/role.orm-entity';
import { PermissionOrmEntity } from './infrastructure/persistence/typeorm/entities/permission.orm-entity';

import { RoleController } from './presentation/http/controllers/role.controller';
import { FindUsersHandler } from './application/queries/find-users/find-users.handler';
import { CreateUserHandler } from './application/commands/manage-users/create-user.handler';
import { UpdateUserHandler } from './application/commands/manage-users/update-user.handler';
import { DeleteUserHandler } from './application/commands/manage-users/delete-user.handler';

import { FindRolesHandler } from './application/queries/find-roles/find-roles.handler';
import { CreateRoleHandler } from './application/commands/manage-roles/create-role.handler';
import { UpdateRoleHandler } from './application/commands/manage-roles/update-role.handler';
import { DeleteRoleHandler } from './application/commands/manage-roles/delete-role.handler';
import { AssignPermissionToRoleHandler } from './application/commands/manage-roles/assign-permission-to-role.handler';
import { RevokePermissionFromRoleHandler } from './application/commands/manage-roles/revoke-permission-from-role.handler';
import { FindPermissionsHandler } from './application/queries/find-permissions/find-permissions.handler';
import { PermissionController } from './presentation/http/controllers/permission.controller';
import { ProfileController } from './presentation/http/controllers/profile.controller';
import { GetProfileHandler } from './application/queries/get-profile/get-profile.handler';
import { UpdateProfileHandler } from './application/commands/update-profile/update-profile.handler';
import { ChangePasswordHandler } from './application/commands/change-password/change-password.handler';

const CommandHandlers = [
  RegisterHandler,
  LoginHandler,
  RecoverPasswordHandler,
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
  CreateRoleHandler,
  UpdateRoleHandler,
  DeleteRoleHandler,
  AssignPermissionToRoleHandler,
  RevokePermissionFromRoleHandler,
  UpdateProfileHandler,
  ChangePasswordHandler,
];

const QueryHandlers = [
  FindUsersHandler,
  FindRolesHandler,
  FindPermissionsHandler,
  GetProfileHandler,
];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    TypeOrmModule.forFeature([
      UserOrmEntity,
      RoleOrmEntity,
      PermissionOrmEntity,
    ]),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const privateKey = (
          config.get<string>('JWT_PRIVATE_KEY') || 'defaultSecretForDevOnly'
        ).replace(/\\n/g, '\n');
        const publicKey = (
          config.get<string>('JWT_PUBLIC_KEY') || 'defaultSecretForDevOnly'
        ).replace(/\\n/g, '\n');
        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '1h',
          },
        };
      },
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    RoleController,
    PermissionController,
    ProfileController,
  ],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    JwtStrategy,
    { provide: 'IUserRepository', useClass: UserRepository },
    { provide: 'IRoleRepository', useClass: RoleRepository },
    { provide: 'IPermissionRepository', useClass: PermissionRepository },
    { provide: 'IHashingService', useClass: BcryptService },
    { provide: 'IJwtService', useClass: AppJwtService },
    { provide: 'IEmailService', useClass: DummyEmailService },
  ],
})
export class IamModule {}
