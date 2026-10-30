import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';
import { StockFiltersDto } from '../dto/stock-filters.dto';
import { CreateStockReservationDto } from '../dto/create-stock-reservation.dto';

import { GetStocksQuery } from '@/inventory/stocks/application/queries/get-stocks/get-stocks.query';
import { GetStockLedgerQuery } from '@/inventory/stocks/application/queries/get-stock-ledger/get-stock-ledger.query';
import { GetAdjustmentsReportQuery } from '@/inventory/stocks/application/queries/get-adjustments-report/get-adjustments-report.query';
import { CreateStockReservationCommand } from '@/inventory/stocks/application/commands/create-stock-reservation/create-stock-reservation.command';
import { ReleaseStockReservationCommand } from '@/inventory/stocks/application/commands/release-stock-reservation/release-stock-reservation.command';

@ApiTags('inventory/stocks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/stocks')
export class InventoryStocksController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Consultar existencias y saldos de inventario en tiempo real',
  })
  @ApiResponse({ status: 200, description: 'Existencias obtenidas con éxito' })
  async findAll(@Query() filters: StockFiltersDto) {
    return this.queryBus.execute(new GetStocksQuery(filters));
  }

  @Get('ledger')
  @ApiOperation({
    summary: 'Consultar el Kárdex / libro mayor de movimientos valorizados',
  })
  @ApiResponse({ status: 200, description: 'Kárdex obtenido con éxito' })
  async findLedger(
    @Query('stockId') stockId?: string,
    @Query('transactionItemId') transactionItemId?: string,
  ) {
    return this.queryBus.execute(
      new GetStockLedgerQuery({ stockId, transactionItemId }),
    );
  }

  @Get('adjustments-report')
  @ApiOperation({ summary: 'Reporte analítico de mermas, pérdidas y ajustes' })
  @ApiResponse({ status: 200, description: 'Reporte obtenido con éxito' })
  async getAdjustmentsReport() {
    return this.queryBus.execute(new GetAdjustmentsReportQuery());
  }

  @Post('reservations')
  @ApiOperation({
    summary: 'Crear una reservación de stock para un documento comercial',
  })
  @ApiResponse({ status: 201, description: 'Reservación creada con éxito' })
  async createReservation(
    @Body() dto: CreateStockReservationDto,
    @CurrentUser() user: any,
  ) {
    return this.commandBus.execute(
      CreateStockReservationCommand.fromDto(dto, user?.userId),
    );
  }

  @Delete('reservations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Liberar / anular una reservación de stock' })
  @ApiResponse({ status: 204, description: 'Reservación liberada' })
  async releaseReservation(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.commandBus.execute(new ReleaseStockReservationCommand(id));
  }
}
