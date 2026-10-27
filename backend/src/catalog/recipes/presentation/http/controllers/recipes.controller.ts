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
import {
  PermissionsGuard,
  RequirePermissions,
} from '@/iam/infrastructure/security/guards/permissions.guard';
import { CurrentUser } from '@/iam/infrastructure/security/decorators/current-user.decorator';

import { CreateRecipeUseCase } from '@/catalog/recipes/application/commands/create-recipe/create-recipe.use-case';
import { CreateRecipeCommand } from '@/catalog/recipes/application/commands/create-recipe/create-recipe.command';
import { UpdateRecipeUseCase } from '@/catalog/recipes/application/commands/update-recipe/update-recipe.use-case';
import { UpdateRecipeCommand } from '@/catalog/recipes/application/commands/update-recipe/update-recipe.command';
import { DeleteRecipeUseCase } from '@/catalog/recipes/application/commands/delete-recipe/delete-recipe.use-case';
import { SyncRecipeCostUseCase } from '@/catalog/recipes/application/commands/sync-recipe-cost/sync-recipe-cost.use-case';
import { FindRecipesUseCase } from '@/catalog/recipes/application/queries/find-recipes/find-recipes.use-case';
import { FindRecipeByIdUseCase } from '@/catalog/recipes/application/queries/find-recipe-by-id/find-recipe-by-id.use-case';

import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { RecipeFiltersDto } from '../dto/recipe-filters.dto';

@ApiTags('catalog/recipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('catalog/recipes')
export class RecipesController {
  constructor(
    private readonly findRecipesUseCase: FindRecipesUseCase,
    private readonly findRecipeByIdUseCase: FindRecipeByIdUseCase,
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly updateRecipeUseCase: UpdateRecipeUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
    private readonly syncRecipeCostUseCase: SyncRecipeCostUseCase,
  ) {}

  @Get()
  @RequirePermissions('recipes:read')
  @ApiOperation({
    summary: 'Listar todas las recetas o listas de materiales (BOM)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de recetas recuperada con éxito',
  })
  async getRecipes(@Query() filters: RecipeFiltersDto) {
    const result = await this.findRecipesUseCase.execute(filters);
    return result;
  }

  @Get(':id')
  @RequirePermissions('recipes:read')
  @ApiOperation({
    summary: 'Obtener detalle de una receta con sus items por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la receta recuperado con éxito',
  })
  async getRecipe(@Param('id', ParseUUIDPipe) id: string) {
    return this.findRecipeByIdUseCase.execute(id);
  }

  @Post()
  @RequirePermissions('recipes:manage')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva receta o lista de materiales (BOM)',
  })
  @ApiResponse({
    status: 201,
    description: 'Receta creada exitosamente',
  })
  async createRecipe(@Body() dto: CreateRecipeDto, @CurrentUser() user: any) {
    const userId = typeof user === 'string' ? user : user?.userId || user?.id;
    const command = new CreateRecipeCommand(
      dto.code,
      dto.name,
      dto.productId,
      dto.status,
      dto.yieldQuantity,
      dto.description,
      dto.items || [],
      dto.syncProductCost,
      userId,
    );
    return this.createRecipeUseCase.execute(command);
  }

  @Put(':id')
  @RequirePermissions('recipes:manage')
  @ApiOperation({
    summary: 'Actualizar una receta existente y sus componentes',
  })
  @ApiResponse({
    status: 200,
    description: 'Receta actualizada exitosamente',
  })
  async updateRecipe(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRecipeDto,
  ) {
    const command = new UpdateRecipeCommand(
      id,
      dto.code,
      dto.name,
      dto.productId,
      dto.status,
      dto.yieldQuantity,
      dto.description,
      dto.items,
      dto.syncProductCost,
    );
    return this.updateRecipeUseCase.execute(command);
  }

  @Delete(':id')
  @RequirePermissions('recipes:manage')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una receta por ID (soft delete)' })
  @ApiResponse({
    status: 204,
    description: 'Receta eliminada exitosamente',
  })
  async deleteRecipe(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteRecipeUseCase.execute(id);
  }

  @Post(':id/sync-cost')
  @RequirePermissions('recipes:manage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Sincronizar el costo unitario de la receta con el producto terminado asociado',
  })
  @ApiResponse({
    status: 200,
    description: 'Costo del producto sincronizado exitosamente',
  })
  async syncCost(@Param('id', ParseUUIDPipe) id: string) {
    return this.syncRecipeCostUseCase.execute(id);
  }
}
