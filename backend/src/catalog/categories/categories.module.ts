import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryOrmEntity } from './infrastructure/persistence/typeorm/entities/category.orm-entity';
import { CategoryRepository } from './infrastructure/persistence/typeorm/repositories/category.repository';
import { CATEGORY_REPOSITORY_TOKEN } from './domain/repositories/category.repository.interface';
import { CategoryController } from './presentation/http/controllers/category.controller';

import { CreateCategoryHandler } from './application/commands/create-category/create-category.handler';
import { UpdateCategoryHandler } from './application/commands/update-category/update-category.handler';
import { DeleteCategoryHandler } from './application/commands/delete-category/delete-category.handler';
import { GetCategoriesHandler } from './application/queries/get-categories/get-categories.handler';
import { GetCategoryHandler } from './application/queries/get-category/get-category.handler';

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];

const QueryHandlers = [GetCategoriesHandler, GetCategoryHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CategoryOrmEntity])],
  controllers: [CategoryController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: CATEGORY_REPOSITORY_TOKEN,
      useClass: CategoryRepository,
    },
  ],
  exports: [CATEGORY_REPOSITORY_TOKEN],
})
export class CategoriesModule {}
