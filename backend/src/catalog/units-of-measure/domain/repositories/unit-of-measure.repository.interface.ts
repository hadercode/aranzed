import { UnitOfMeasure } from '../entities/unit-of-measure.entity';

export const UNIT_OF_MEASURE_REPOSITORY_TOKEN = 'IUnitOfMeasureRepository';

export interface IUnitOfMeasureRepository {
  findById(id: string): Promise<UnitOfMeasure | null>;
  findByCode(code: string): Promise<UnitOfMeasure | null>;
  findAll(): Promise<UnitOfMeasure[]>;
  save(unitOfMeasure: UnitOfMeasure): Promise<UnitOfMeasure>;
  delete(id: string): Promise<void>;
}
