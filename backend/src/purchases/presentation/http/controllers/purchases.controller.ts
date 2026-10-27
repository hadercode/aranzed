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

import { CreatePurchaseUseCase } from '@/purchases/application/commands/create-purchase/create-purchase.use-case';
import { CreatePurchaseCommand } from '@/purchases/application/commands/create-purchase/create-purchase.command';
import { UpdatePurchaseUseCase } from '@/purchases/application/commands/update-purchase/update-purchase.use-case';
import { UpdatePurchaseCommand } from '@/purchases/application/commands/update-purchase/update-purchase.command';
import { UpdatePurchaseStatusUseCase } from '@/purchases/application/commands/update-purchase-status/update-purchase-status.use-case';
import { UpdatePurchaseStatusCommand } from '@/purchases/application/commands/update-purchase-status/update-purchase-status.command';
import { DeletePurchaseUseCase } from '@/purchases/application/commands/delete-purchase/delete-purchase.use-case';
import { FindPurchasesUseCase } from '@/purchases/application/queries/find-purchases/find-purchases.use-case';
import { FindPurchaseByIdUseCase } from '@/purchases/application/queries/find-purchase-by-id/find-purchase-by-id.use-case';

import {
  CreatePurchaseDto,
  UpdatePurchaseDto,
  UpdatePurchaseStatusDto,
  FindPurchasesQueryDto,
  PurchaseResponseDto,
} from '../dto';
import { PurchaseResponseMapper } from '../mappers';

@ApiTags('Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('purchases')
export class PurchasesController {
  constructor(
    private readonly findPurchasesUseCase: FindPurchasesUseCase,
    private readonly findPurchaseByIdUseCase: FindPurchaseByIdUseCase,
    private readonly createPurchaseUseCase: CreatePurchaseUseCase,
    private readonly updatePurchaseUseCase: UpdatePurchaseUseCase,
    private readonly updatePurchaseStatusUseCase: UpdatePurchaseStatusUseCase,
    private readonly deletePurchaseUseCase: DeletePurchaseUseCase,
  ) {}

  @Get()
  @RequirePermissions('purchases:read')
  @ApiOperation({
    summary: 'Listar compras de materiales con filtros y paginación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de compras recuperada exitosamente',
  })
  async getPurchases(@Query() query: FindPurchasesQueryDto) {
    const result = await this.findPurchasesUseCase.execute(query);
    return {
      purchases: PurchaseResponseMapper.toDtoList(result.purchases),
      total: result.total,
    };
  }

  @Get(':id')
  @RequirePermissions('purchases:read')
  @ApiOperation({ summary: 'Obtener detalle completo de una compra por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la compra recuperado exitosamente',
    type: PurchaseResponseDto,
  })
  async getPurchase(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PurchaseResponseDto> {
    const purchase = await this.findPurchaseByIdUseCase.execute(id);
    return PurchaseResponseMapper.toDto(purchase);
  }

  @Post()
  @RequirePermissions('purchases:manage')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Registrar una nueva compra de materiales (emite evento si estado es COMPLETED)',
  })
  @ApiResponse({
    status: 201,
    description: 'Compra registrada exitosamente',
    type: PurchaseResponseDto,
  })
  async createPurchase(
    @Body() dto: CreatePurchaseDto,
    @CurrentUser('id') userId?: string,
  ): Promise<PurchaseResponseDto> {
    const purchase = await this.createPurchaseUseCase.execute(
      CreatePurchaseCommand.fromDto(dto, userId),
    );
    return PurchaseResponseMapper.toDto(purchase);
  }

  @Put(':id')
  @RequirePermissions('purchases:manage')
  @ApiOperation({
    summary:
      'Actualizar una compra de materiales (emite evento si estado pasa a COMPLETED)',
  })
  @ApiResponse({
    status: 200,
    description: 'Compra actualizada exitosamente',
    type: PurchaseResponseDto,
  })
  async updatePurchase(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    const purchase = await this.updatePurchaseUseCase.execute(
      UpdatePurchaseCommand.fromDto(id, dto),
    );
    return PurchaseResponseMapper.toDto(purchase);
  }

  @Patch(':id/status')
  @RequirePermissions('purchases:manage')
  @ApiOperation({
    summary:
      'Actualizar estado de una compra (emite evento de entrada de stock si pasa a COMPLETED)',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de compra actualizado con éxito',
    type: PurchaseResponseDto,
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePurchaseStatusDto,
  ): Promise<PurchaseResponseDto> {
    const command = new UpdatePurchaseStatusCommand(id, dto.status);
    const purchase = await this.updatePurchaseStatusUseCase.execute(command);
    return PurchaseResponseMapper.toDto(purchase);
  }

  @Delete(':id')
  @RequirePermissions('purchases:manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una compra en borrador (soft delete)' })
  @ApiResponse({
    status: 204,
    description: 'Compra eliminada exitosamente',
  })
  async deletePurchase(@Param('id', ParseUUIDPipe) id: string) {
    await this.deletePurchaseUseCase.execute(id);
  }
}
