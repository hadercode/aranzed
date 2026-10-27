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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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

import { CreateUomCommand } from '@/catalog/units-of-measure/application/commands/create-uom/create-uom.command';
import { UpdateUomCommand } from '@/catalog/units-of-measure/application/commands/update-uom/update-uom.command';
import { DeleteUomCommand } from '@/catalog/units-of-measure/application/commands/delete-uom/delete-uom.command';
import { GetUomsQuery } from '@/catalog/units-of-measure/application/queries/get-uoms/get-uoms.query';
import { GetUomQuery } from '@/catalog/units-of-measure/application/queries/get-uom/get-uom.query';

import { CreateUomDto } from '../dto/create-uom.dto';
import { UpdateUomDto } from '../dto/update-uom.dto';

@ApiTags('catalog/uofm')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('catalog/uofm')
export class UnitOfMeasureController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermissions('uofm:read')
  @ApiOperation({ summary: 'Listar todas las unidades de medida' })
  @ApiResponse({
    status: 200,
    description: 'Lista de unidades de medida recuperada con éxito',
  })
  async getUoms() {
    return this.queryBus.execute(new GetUomsQuery());
  }

  @Get(':id')
  @RequirePermissions('uofm:read')
  @ApiOperation({ summary: 'Obtener detalle de una unidad de medida por ID' })
  @ApiResponse({ status: 200, description: 'Unidad de medida encontrada' })
  @ApiResponse({ status: 404, description: 'Unidad de medida no encontrada' })
  async getUom(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.queryBus.execute(new GetUomQuery(id));
  }

  @Post()
  @RequirePermissions('uofm:manage')
  @ApiOperation({ summary: 'Crear una nueva unidad de medida' })
  @ApiResponse({
    status: 201,
    description: 'Unidad de medida creada con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o código duplicado',
  })
  async createUom(@Body() dto: CreateUomDto, @CurrentUser() user: any) {
    return this.commandBus.execute(
      new CreateUomCommand(
        dto.code,
        dto.name,
        dto.isActive,
        dto.allowDecimals,
        user?.userId,
      ),
    );
  }

  @Put(':id')
  @RequirePermissions('uofm:manage')
  @ApiOperation({ summary: 'Actualizar una unidad de medida existente' })
  @ApiResponse({
    status: 200,
    description: 'Unidad de medida actualizada con éxito',
  })
  @ApiResponse({ status: 404, description: 'Unidad de medida no encontrada' })
  async updateUom(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUomDto,
  ) {
    return this.commandBus.execute(
      new UpdateUomCommand(id, {
        code: dto.code,
        name: dto.name,
        isActive: dto.isActive,
        allowDecimals: dto.allowDecimals,
      }),
    );
  }

  @Delete(':id')
  @RequirePermissions('uofm:manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una unidad de medida' })
  @ApiResponse({
    status: 204,
    description: 'Unidad de medida eliminada con éxito',
  })
  @ApiResponse({ status: 404, description: 'Unidad de medida no encontrada' })
  async deleteUom(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.commandBus.execute(new DeleteUomCommand(id));
  }
}
