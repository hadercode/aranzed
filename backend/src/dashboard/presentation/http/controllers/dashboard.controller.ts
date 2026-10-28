import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';
import { GetDashboardSummaryQuery } from '@/dashboard/application/queries/get-dashboard-summary/get-dashboard-summary.query';
import { DashboardSummaryResponseDto } from '@/dashboard/presentation/http/dto/dashboard-summary-response.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Obtener métricas consolidadas, actividad reciente y alertas del dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen del dashboard obtenido exitosamente',
    type: DashboardSummaryResponseDto,
  })
  async getSummary(
    @CurrentUser('id') userId?: string,
  ): Promise<DashboardSummaryResponseDto> {
    return this.queryBus.execute(new GetDashboardSummaryQuery(userId));
  }
}
