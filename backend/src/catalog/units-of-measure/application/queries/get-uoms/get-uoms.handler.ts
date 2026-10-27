import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UnitOfMeasure } from '@/catalog/units-of-measure/domain/entities/unit-of-measure.entity';
import { GetUomsQuery } from './get-uoms.query';

@QueryHandler(GetUomsQuery)
export class GetUomsHandler implements IQueryHandler<GetUomsQuery> {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly repository: IUnitOfMeasureRepository,
  ) {}

  async execute(): Promise<UnitOfMeasure[]> {
    return this.repository.findAll();
  }
}
