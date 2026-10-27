import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { FindUsersQuery } from '@/iam/application/queries/find-users/find-users.query';
import { CreateUserCommand } from '@/iam/application/commands/manage-users/create-user.command';
import { UpdateUserCommand } from '@/iam/application/commands/manage-users/update-user.command';
import { DeleteUserCommand } from '@/iam/application/commands/manage-users/delete-user.command';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermissions('users:manage')
  async findAll() {
    return this.queryBus.execute(new FindUsersQuery());
  }

  @Post()
  @RequirePermissions('users:manage')
  async create(
    @Body() body: { email: string; password?: string; roles?: string[] },
  ) {
    return this.commandBus.execute(
      new CreateUserCommand(body.email, body.password, body.roles),
    );
  }

  @Put(':id')
  @RequirePermissions('users:manage')
  async update(
    @Param('id') id: string,
    @Body() body: { email?: string; password?: string; roles?: string[] },
  ) {
    await this.commandBus.execute(
      new UpdateUserCommand(id, body.email, body.password, body.roles),
    );
  }

  @Delete(':id')
  @RequirePermissions('users:manage')
  async remove(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
