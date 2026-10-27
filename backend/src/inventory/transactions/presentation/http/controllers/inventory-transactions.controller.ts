import {
  Controller,
  Get,
  Post,
  Put,
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

import { CreateInventoryTransactionUseCase } from '@/inventory/transactions/application/commands/create-inventory-transaction/create-inventory-transaction.use-case';
import { CreateInventoryTransactionCommand } from '@/inventory/transactions/application/commands/create-inventory-transaction/create-inventory-transaction.command';
import { UpdateInventoryTransactionUseCase } from '@/inventory/transactions/application/commands/update-inventory-transaction/update-inventory-transaction.use-case';
import { UpdateInventoryTransactionCommand } from '@/inventory/transactions/application/commands/update-inventory-transaction/update-inventory-transaction.command';
import { DeleteInventoryTransactionUseCase } from '@/inventory/transactions/application/commands/delete-inventory-transaction/delete-inventory-transaction.use-case';
import { DeleteInventoryTransactionCommand } from '@/inventory/transactions/application/commands/delete-inventory-transaction/delete-inventory-transaction.command';
import { FindInventoryTransactionsUseCase } from '@/inventory/transactions/application/queries/find-inventory-transactions/find-inventory-transactions.use-case';
import { FindInventoryTransactionsQuery } from '@/inventory/transactions/application/queries/find-inventory-transactions/find-inventory-transactions.query';
import { FindInventoryTransactionByIdUseCase } from '@/inventory/transactions/application/queries/find-inventory-transaction-by-id/find-inventory-transaction-by-id.use-case';
import { FindInventoryTransactionByIdQuery } from '@/inventory/transactions/application/queries/find-inventory-transaction-by-id/find-inventory-transaction-by-id.query';

import {
  CreateInventoryTransactionDto,
  UpdateInventoryTransactionDto,
  TransactionFiltersDto,
  InventoryTransactionResponseDto,
  PaginatedInventoryTransactionsResponseDto,
} from '../dto';
import { InventoryTransactionResponseMapper } from '../mappers';

interface AuthenticatedUserContext {
  id?: string;
  userId?: string;
}

@ApiTags('inventory/transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/transactions')
export class InventoryTransactionsController {
  constructor(
    private readonly findTransactionsUseCase: FindInventoryTransactionsUseCase,
    private readonly findByIdUseCase: FindInventoryTransactionByIdUseCase,
    private readonly createTransactionUseCase: CreateInventoryTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateInventoryTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteInventoryTransactionUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Listar movimientos y transacciones de inventario con filtros y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Transacciones obtenidas con éxito',
    type: PaginatedInventoryTransactionsResponseDto,
  })
  async findAll(
    @Query() filters: TransactionFiltersDto,
  ): Promise<PaginatedInventoryTransactionsResponseDto> {
    const result = await this.findTransactionsUseCase.execute(
      new FindInventoryTransactionsQuery(filters),
    );
    return InventoryTransactionResponseMapper.toPaginatedDto(result);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de una transacción de inventario por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Transacción encontrada',
    type: InventoryTransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<InventoryTransactionResponseDto> {
    const transaction = await this.findByIdUseCase.execute(
      new FindInventoryTransactionByIdQuery(id),
    );
    return InventoryTransactionResponseMapper.toDto(transaction);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción de inventario' })
  @ApiResponse({
    status: 201,
    description: 'Transacción creada exitosamente',
    type: InventoryTransactionResponseDto,
  })
  async create(
    @Body() dto: CreateInventoryTransactionDto,
    @CurrentUser() user?: AuthenticatedUserContext,
  ): Promise<InventoryTransactionResponseDto> {
    const userId = user?.id || user?.userId;
    const command = CreateInventoryTransactionCommand.fromDto(dto, userId);
    const transaction = await this.createTransactionUseCase.execute(command);
    return InventoryTransactionResponseMapper.toDto(transaction);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar o cambiar estado de una transacción de inventario',
  })
  @ApiResponse({
    status: 200,
    description: 'Transacción actualizada exitosamente',
    type: InventoryTransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateInventoryTransactionDto,
    @CurrentUser() user?: AuthenticatedUserContext,
  ): Promise<InventoryTransactionResponseDto> {
    const userId = user?.id || user?.userId;
    const command = UpdateInventoryTransactionCommand.fromDto(id, dto, userId);
    const transaction = await this.updateTransactionUseCase.execute(command);
    return InventoryTransactionResponseMapper.toDto(transaction);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar o revertir una transacción de inventario',
  })
  @ApiResponse({
    status: 204,
    description: 'Transacción eliminada exitosamente',
  })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.deleteTransactionUseCase.execute(
      new DeleteInventoryTransactionCommand(id),
    );
  }
}
