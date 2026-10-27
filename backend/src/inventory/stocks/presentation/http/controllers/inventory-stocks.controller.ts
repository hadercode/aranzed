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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/iam/infrastructure/security/guards/jwt-auth.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';
import { InventoryStocksService } from '@/inventory/stocks/application/services/inventory-stocks.service';
import { StockFiltersDto } from '../dto/stock-filters.dto';
import { CreateStockReservationDto } from '../dto/create-stock-reservation.dto';

@ApiTags('inventory/stocks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/stocks')
export class InventoryStocksController {
  constructor(private readonly stocksService: InventoryStocksService) {}

  @Get()
  @ApiOperation({
    summary: 'Consultar existencias y saldos de inventario en tiempo real',
  })
  @ApiResponse({ status: 200, description: 'Existencias obtenidas con éxito' })
  async findAll(@Query() filters: StockFiltersDto) {
    return this.stocksService.findAll(filters);
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
    return this.stocksService.findLedger({ stockId, transactionItemId });
  }

  @Get('adjustments-report')
  @ApiOperation({ summary: 'Reporte analítico de mermas, pérdidas y ajustes' })
  @ApiResponse({ status: 200, description: 'Reporte obtenido con éxito' })
  async getAdjustmentsReport() {
    return this.stocksService.getAdjustmentsReport();
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
    return this.stocksService.createReservation(dto, user?.userId);
  }

  @Delete('reservations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Liberar / anular una reservación de stock' })
  @ApiResponse({ status: 204, description: 'Reservación liberada' })
  async releaseReservation(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.stocksService.releaseReservation(id);
  }
}
