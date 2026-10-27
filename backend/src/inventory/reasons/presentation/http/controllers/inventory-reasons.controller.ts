import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
import { InventoryReasonsService } from '@/inventory/reasons/application/services/inventory-reasons.service';
import { CreateInventoryReasonDto } from '../dto/create-inventory-reason.dto';
import { UpdateInventoryReasonDto } from '../dto/update-inventory-reason.dto';

@ApiTags('inventory/reasons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/reasons')
export class InventoryReasonsController {
  constructor(private readonly reasonsService: InventoryReasonsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los motivos de inventario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de motivos recuperada con éxito',
  })
  async findAll() {
    return this.reasonsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un motivo por ID' })
  @ApiResponse({ status: 200, description: 'Motivo encontrado' })
  @ApiResponse({ status: 404, description: 'Motivo no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.reasonsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo motivo de inventario' })
  @ApiResponse({ status: 201, description: 'Motivo creado exitosamente' })
  async create(
    @Body() dto: CreateInventoryReasonDto,
    @CurrentUser() user: any,
  ) {
    return this.reasonsService.create(dto, user?.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un motivo existente' })
  @ApiResponse({ status: 200, description: 'Motivo actualizado' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateInventoryReasonDto,
  ) {
    return this.reasonsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar (soft delete) un motivo' })
  @ApiResponse({ status: 204, description: 'Motivo eliminado' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.reasonsService.remove(id);
  }
}
