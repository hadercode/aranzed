import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';

import { CreateSaleUseCase } from '@/sales/application/commands/create-sale/create-sale.use-case';
import { CreateSaleCommand } from '@/sales/application/commands/create-sale/create-sale.command';
import { UpdateSaleUseCase } from '@/sales/application/commands/update-sale/update-sale.use-case';
import { UpdateSaleCommand } from '@/sales/application/commands/update-sale/update-sale.command';
import { UpdateSaleStatusUseCase } from '@/sales/application/commands/update-sale-status/update-sale-status.use-case';
import { UpdateSaleStatusCommand } from '@/sales/application/commands/update-sale-status/update-sale-status.command';
import { UpdateSalePaidStatusUseCase } from '@/sales/application/commands/update-sale-paid-status/update-sale-paid-status.use-case';
import { UpdateSalePaidStatusCommand } from '@/sales/application/commands/update-sale-paid-status/update-sale-paid-status.command';
import { ConvertQuotationUseCase } from '@/sales/application/commands/convert-quotation/convert-quotation.use-case';
import { ConvertQuotationCommand } from '@/sales/application/commands/convert-quotation/convert-quotation.command';
import { DeleteSaleUseCase } from '@/sales/application/commands/delete-sale/delete-sale.use-case';
import { FindSalesUseCase } from '@/sales/application/queries/find-sales/find-sales.use-case';
import { FindSaleByIdUseCase } from '@/sales/application/queries/find-sale-by-id/find-sale-by-id.use-case';
import { FindSaleStatsUseCase } from '@/sales/application/queries/find-sale-stats/find-sale-stats.use-case';

import {
  CreateSaleDto,
  UpdateSaleDto,
  UpdateSaleStatusDto,
  UpdateSalePaidStatusDto,
  FindSalesQueryDto,
  SaleResponseDto,
  SaleStatsResponseDto,
} from '../dto';
import { SaleResponseMapper } from '../mappers';

@ApiTags('Sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('sales')
export class SalesController {
  constructor(
    private readonly findSalesUseCase: FindSalesUseCase,
    private readonly findSaleByIdUseCase: FindSaleByIdUseCase,
    private readonly findSaleStatsUseCase: FindSaleStatsUseCase,
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly updateSaleUseCase: UpdateSaleUseCase,
    private readonly updateSaleStatusUseCase: UpdateSaleStatusUseCase,
    private readonly updateSalePaidStatusUseCase: UpdateSalePaidStatusUseCase,
    private readonly convertQuotationUseCase: ConvertQuotationUseCase,
    private readonly deleteSaleUseCase: DeleteSaleUseCase,
  ) {}

  @Get()
  @RequirePermissions('sales:read')
  @ApiOperation({
    summary: 'Listar ventas y cotizaciones con filtros y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de ventas obtenido exitosamente',
  })
  async findAll(@Query() query: FindSalesQueryDto) {
    const result = await this.findSalesUseCase.execute(query);
    return {
      sales: SaleResponseMapper.toDtoList(result.sales),
      total: result.total,
    };
  }

  @Get('stats')
  @RequirePermissions('sales:read')
  @ApiOperation({ summary: 'Obtener métricas y KPIs consolidados de ventas' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    type: SaleStatsResponseDto,
  })
  async getStats(
    @Query() query: FindSalesQueryDto,
  ): Promise<SaleStatsResponseDto> {
    const stats = await this.findSaleStatsUseCase.execute(query);
    return SaleResponseMapper.toStatsDto(stats);
  }

  @Get(':id')
  @RequirePermissions('sales:read')
  @ApiOperation({
    summary: 'Obtener el detalle completo de una venta o cotización por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta encontrada',
    type: SaleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SaleResponseDto> {
    const sale = await this.findSaleByIdUseCase.execute(id);
    return SaleResponseMapper.toDto(sale);
  }

  @Post()
  @RequirePermissions('sales:manage')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Registrar una nueva venta o cotización (emite evento si es COMPLETED)',
  })
  @ApiResponse({
    status: 201,
    description: 'Venta registrada con éxito',
    type: SaleResponseDto,
  })
  async create(
    @Body() dto: CreateSaleDto,
    @CurrentUser('id') userId?: string,
  ): Promise<SaleResponseDto> {
    const command = CreateSaleCommand.fromDto(dto, userId);
    const sale = await this.createSaleUseCase.execute(command);
    return SaleResponseMapper.toDto(sale);
  }

  @Post(':id/convert')
  @RequirePermissions('sales:manage')
  @ApiOperation({
    summary: 'Convertir una cotización existente en una venta directa formal',
  })
  @ApiResponse({
    status: 200,
    description: 'Cotización convertida en venta con éxito',
    type: SaleResponseDto,
  })
  async convertQuotation(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId?: string,
  ): Promise<SaleResponseDto> {
    const command = new ConvertQuotationCommand(id, undefined, userId);
    const sale = await this.convertQuotationUseCase.execute(command);
    return SaleResponseMapper.toDto(sale);
  }

  @Put(':id')
  @RequirePermissions('sales:manage')
  @ApiOperation({ summary: 'Actualizar una venta o cotización existente' })
  @ApiResponse({
    status: 200,
    description: 'Venta actualizada exitosamente',
    type: SaleResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSaleDto,
    @CurrentUser('id') userId?: string,
  ): Promise<SaleResponseDto> {
    const command = UpdateSaleCommand.fromDto(id, dto, userId);
    const sale = await this.updateSaleUseCase.execute(command);
    return SaleResponseMapper.toDto(sale);
  }

  @Patch(':id/status')
  @RequirePermissions('sales:manage')
  @ApiOperation({
    summary:
      'Actualizar estado de una venta (emite evento si pasa a COMPLETED o CANCELLED)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente',
    type: SaleResponseDto,
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSaleStatusDto,
    @CurrentUser('id') userId?: string,
  ): Promise<SaleResponseDto> {
    const command = new UpdateSaleStatusCommand(
      id,
      dto.status,
      dto.cancelReason,
      userId,
    );
    const sale = await this.updateSaleStatusUseCase.execute(command);
    return SaleResponseMapper.toDto(sale);
  }

  @Patch(':id/paid-status')
  @RequirePermissions('sales:manage')
  @ApiOperation({
    summary:
      'Actualizar estado de pago de una venta (PENDIENTE, ABONADO, PAGADO - emite evento desacoplado)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de pago actualizado exitosamente',
    type: SaleResponseDto,
  })
  async updatePaidStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSalePaidStatusDto,
    @CurrentUser('id') userId?: string,
  ): Promise<SaleResponseDto> {
    const command = new UpdateSalePaidStatusCommand(id, dto.paidStatus, userId);
    const sale = await this.updateSalePaidStatusUseCase.execute(command);
    return SaleResponseMapper.toDto(sale);
  }

  @Delete(':id')
  @RequirePermissions('sales:manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una venta en borrador o cancelada' })
  @ApiResponse({ status: 204, description: 'Venta eliminada exitosamente' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteSaleUseCase.execute(id);
  }
}
