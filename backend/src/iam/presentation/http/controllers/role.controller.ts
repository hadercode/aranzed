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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { FindRolesQuery } from '@/iam/application/queries/find-roles/find-roles.query';
import { CreateRoleCommand } from '@/iam/application/commands/manage-roles/create-role.command';
import { UpdateRoleCommand } from '@/iam/application/commands/manage-roles/update-role.command';
import { DeleteRoleCommand } from '@/iam/application/commands/manage-roles/delete-role.command';
import { AssignPermissionToRoleCommand } from '@/iam/application/commands/manage-roles/assign-permission-to-role.command';
import { RevokePermissionFromRoleCommand } from '@/iam/application/commands/manage-roles/revoke-permission-from-role.command';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermissions('roles:manage')
  async findAll() {
    return this.queryBus.execute(new FindRolesQuery());
  }

  @Post()
  @RequirePermissions('roles:manage')
  async create(@Body() body: { name: string; description: string }) {
    return this.commandBus.execute(
      new CreateRoleCommand(body.name, body.description),
    );
  }

  @Put(':id')
  @RequirePermissions('roles:manage')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    await this.commandBus.execute(
      new UpdateRoleCommand(id, body.name, body.description),
    );
  }

  @Delete(':id')
  @RequirePermissions('roles:manage')
  async remove(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteRoleCommand(id));
  }

  @Post(':id/permissions')
  @RequirePermissions('roles:manage')
  async assignPermission(
    @Param('id') id: string,
    @Body() body: { permissionId: string },
  ) {
    await this.commandBus.execute(
      new AssignPermissionToRoleCommand(id, body.permissionId),
    );
  }

  @Delete(':id/permissions/:permissionId')
  @RequirePermissions('roles:manage')
  async revokePermission(
    @Param('id') id: string,
    @Param('permissionId') permissionId: string,
  ) {
    await this.commandBus.execute(
      new RevokePermissionFromRoleCommand(id, permissionId),
    );
  }
}
