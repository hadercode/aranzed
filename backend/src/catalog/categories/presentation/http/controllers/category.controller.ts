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

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { GetCategoryQuery } from '@/catalog/categories/application/queries/get-category/get-category.query';
import { GetCategoriesQuery } from '@/catalog/categories/application/queries/get-categories/get-categories.query';
import { CreateCategoryCommand } from '@/catalog/categories/application/commands/create-category/create-category.command';
import { UpdateCategoryCommand } from '@/catalog/categories/application/commands/update-category/update-category.command';
import { DeleteCategoryCommand } from '@/catalog/categories/application/commands/delete-category/delete-category.command';

@ApiTags('catalog/categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('catalog/categories')
export class CategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermissions('categories:read')
  @ApiOperation({ summary: 'Listar todas las categorías del catálogo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías recuperada con éxito',
  })
  async getCategories() {
    return this.queryBus.execute(new GetCategoriesQuery());
  }

  @Get(':id')
  @RequirePermissions('categories:read')
  @ApiOperation({ summary: 'Obtener detalle de una categoría por ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async getCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.queryBus.execute(new GetCategoryQuery(id));
  }

  @Post()
  @RequirePermissions('categories:manage')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada con éxito' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o nombre duplicado',
  })
  async createCategory(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() user: any,
  ) {
    return this.commandBus.execute(
      new CreateCategoryCommand(
        dto.name,
        dto.parentId,
        dto.isActive,
        user?.userId,
      ),
    );
  }

  @Put(':id')
  @RequirePermissions('categories:manage')
  @ApiOperation({ summary: 'Actualizar una categoría existente' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada con éxito' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.commandBus.execute(
      new UpdateCategoryCommand(id, {
        name: dto.name,
        parentId: dto.parentId,
        isActive: dto.isActive,
      }),
    );
  }

  @Delete(':id')
  @RequirePermissions('categories:manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiResponse({ status: 204, description: 'Categoría eliminada con éxito' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async deleteCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.commandBus.execute(new DeleteCategoryCommand(id));
  }
}
