import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UnitOfMeasureOrmEntity } from './infrastructure/persistence/typeorm/entities/unit-of-measure.orm-entity';
import { UnitOfMeasureRepository } from './infrastructure/persistence/typeorm/repositories/unit-of-measure.repository';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from './domain/repositories/unit-of-measure.repository.interface';
import { UnitOfMeasureController } from './presentation/http/controllers/unit-of-measure.controller';

import { CreateUomHandler } from './application/commands/create-uom/create-uom.handler';
import { UpdateUomHandler } from './application/commands/update-uom/update-uom.handler';
import { DeleteUomHandler } from './application/commands/delete-uom/delete-uom.handler';
import { GetUomsHandler } from './application/queries/get-uoms/get-uoms.handler';
import { GetUomHandler } from './application/queries/get-uom/get-uom.handler';

const CommandHandlers = [CreateUomHandler, UpdateUomHandler, DeleteUomHandler];

const QueryHandlers = [GetUomsHandler, GetUomHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UnitOfMeasureOrmEntity])],
  controllers: [UnitOfMeasureController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: UNIT_OF_MEASURE_REPOSITORY_TOKEN,
      useClass: UnitOfMeasureRepository,
    },
  ],
  exports: [UNIT_OF_MEASURE_REPOSITORY_TOKEN],
})
export class UnitsOfMeasureModule {}
