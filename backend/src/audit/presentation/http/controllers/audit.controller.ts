import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import { AuditService } from '../../../application/services/audit.service';
import { QueryAuditLogsDto } from '../dto/query-audit-logs.dto';

@ApiTags('audit')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  private checkPermission(req: any) {
    const user = req.user;
    if (!user) {
      throw new ForbiddenException('No autenticado');
    }
    const permissions: string[] = user.permissions || [];
    const roles: string[] = user.roles || [];
    // Allow if user has audit permissions or admin role
    const hasPermission =
      permissions.includes('audit:read') ||
      permissions.includes('audit:manage') ||
      permissions.includes('users:manage') ||
      roles.includes('ADMIN') ||
      roles.includes('ADMIN_ROLE');

    if (!hasPermission) {
      throw new ForbiddenException(
        'No tienes permisos suficientes para ver las auditorías',
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener listado paginado y filtrado de trazas de auditoría',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de logs de auditoría obtenido con éxito',
  })
  async findAll(@Req() req: any, @Query() query: QueryAuditLogsDto) {
    this.checkPermission(req);
    return this.auditService.findAll(query);
  }

  @Get('stats/summary')
  @ApiOperation({ summary: 'Obtener métricas y resumen de auditoría' })
  async getStats(@Req() req: any) {
    this.checkPermission(req);
    return this.auditService.getStats();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar detalle completo de un registro de auditoría',
  })
  @ApiResponse({ status: 200, description: 'Detalle de auditoría' })
  async findById(@Req() req: any, @Param('id') id: string) {
    this.checkPermission(req);
    const log = await this.auditService.findById(id);
    if (!log) {
      throw new NotFoundException(
        `Registro de auditoría con ID ${id} no encontrado`,
      );
    }
    return log;
  }
}
