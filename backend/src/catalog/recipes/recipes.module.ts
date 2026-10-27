import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecipeOrmEntity } from './infrastructure/persistence/typeorm/entities/recipe.orm-entity';
import { RecipeItemOrmEntity } from './infrastructure/persistence/typeorm/entities/recipe-item.orm-entity';
import { TypeOrmRecipeRepository } from './infrastructure/persistence/typeorm/repositories/typeorm-recipe.repository';
import { RECIPE_REPOSITORY_TOKEN } from './domain/repositories/recipe.repository.interface';

import { RecipesController } from './presentation/http/controllers/recipes.controller';

import { CreateRecipeUseCase } from './application/commands/create-recipe/create-recipe.use-case';
import { UpdateRecipeUseCase } from './application/commands/update-recipe/update-recipe.use-case';
import { DeleteRecipeUseCase } from './application/commands/delete-recipe/delete-recipe.use-case';
import { SyncRecipeCostUseCase } from './application/commands/sync-recipe-cost/sync-recipe-cost.use-case';
import { FindRecipesUseCase } from './application/queries/find-recipes/find-recipes.use-case';
import { FindRecipeByIdUseCase } from './application/queries/find-recipe-by-id/find-recipe-by-id.use-case';

import { ProductsModule } from '../products/products.module';

const UseCases = [
  CreateRecipeUseCase,
  UpdateRecipeUseCase,
  DeleteRecipeUseCase,
  SyncRecipeCostUseCase,
  FindRecipesUseCase,
  FindRecipeByIdUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeOrmEntity, RecipeItemOrmEntity]),
    ProductsModule,
  ],
  controllers: [RecipesController],
  providers: [
    ...UseCases,
    {
      provide: RECIPE_REPOSITORY_TOKEN,
      useClass: TypeOrmRecipeRepository,
    },
  ],
  exports: [RECIPE_REPOSITORY_TOKEN, ...UseCases],
})
export class RecipesModule {}
