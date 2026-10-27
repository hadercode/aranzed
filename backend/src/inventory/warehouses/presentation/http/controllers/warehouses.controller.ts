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
import { WarehousesService } from '@/inventory/warehouses/application/services/warehouses.service';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';

@ApiTags('inventory/warehouses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory/warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los almacenes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de almacenes recuperada con éxito',
  })
  async findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un almacén por ID' })
  @ApiResponse({ status: 200, description: 'Almacén encontrado' })
  @ApiResponse({ status: 404, description: 'Almacén no encontrado' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.warehousesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo almacén' })
  @ApiResponse({ status: 201, description: 'Almacén creado exitosamente' })
  async create(@Body() dto: CreateWarehouseDto, @CurrentUser() user: any) {
    return this.warehousesService.create(dto, user?.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un almacén existente' })
  @ApiResponse({ status: 200, description: 'Almacén actualizado' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWarehouseDto,
    @CurrentUser() user: any,
  ) {
    return this.warehousesService.update(id, dto, user?.userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar (soft delete) un almacén' })
  @ApiResponse({ status: 204, description: 'Almacén eliminado' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.warehousesService.remove(id);
  }
}
