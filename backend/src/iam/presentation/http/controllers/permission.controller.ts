import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FindPermissionsQuery } from '@/iam/application/queries/find-permissions/find-permissions.query';

@ApiTags('permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermissions('roles:manage')
  async findAll() {
    return this.queryBus.execute(new FindPermissionsQuery());
  }
}
