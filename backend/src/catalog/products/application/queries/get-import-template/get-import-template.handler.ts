import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProductImportTemplateQuery } from './get-import-template.query';
import { ProductImportTemplateGenerator } from '@/catalog/products/infrastructure/excel/product-import-template.generator';
import type { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import type { ICategoryRepository } from '@/catalog/categories/domain/repositories/category.repository.interface';
import { CATEGORY_REPOSITORY_TOKEN } from '@/catalog/categories/domain/repositories/category.repository.interface';

@QueryHandler(GetProductImportTemplateQuery)
export class GetProductImportTemplateHandler
  implements IQueryHandler<GetProductImportTemplateQuery, Buffer>
{
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly uomRepository: IUnitOfMeasureRepository,
    @Inject(CATEGORY_REPOSITORY_TOKEN)
    private readonly categoryRepository: ICategoryRepository,
    private readonly templateGenerator: ProductImportTemplateGenerator,
  ) {}

  async execute(): Promise<Buffer> {
    const [uoms, categories] = await Promise.all([
      this.uomRepository.findAll(),
      this.categoryRepository.findAll(),
    ]);

    return this.templateGenerator.generate(uoms, categories);
  }
}
