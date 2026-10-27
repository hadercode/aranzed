import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { UnitsOfMeasureModule } from './units-of-measure/units-of-measure.module';
import { ProductsModule } from './products/products.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    CategoriesModule,
    UnitsOfMeasureModule,
    ProductsModule,
    RecipesModule,
  ],
  exports: [
    CategoriesModule,
    UnitsOfMeasureModule,
    ProductsModule,
    RecipesModule,
  ],
})
export class CatalogModule {}
