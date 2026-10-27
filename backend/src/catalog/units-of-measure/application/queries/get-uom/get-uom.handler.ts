import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UnitOfMeasure } from '@/catalog/units-of-measure/domain/entities/unit-of-measure.entity';
import { EntityNotFoundException } from '@/core/domain/domain-exception';
import { GetUomQuery } from './get-uom.query';

@QueryHandler(GetUomQuery)
export class GetUomHandler implements IQueryHandler<GetUomQuery> {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly repository: IUnitOfMeasureRepository,
  ) {}

  async execute(query: GetUomQuery): Promise<UnitOfMeasure> {
    const uom = await this.repository.findById(query.id);
    if (!uom) {
      throw new EntityNotFoundException('Unidad de Medida', query.id);
    }
    return uom;
  }
}
