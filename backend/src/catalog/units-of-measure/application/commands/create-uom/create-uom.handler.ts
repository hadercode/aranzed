import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUomCommand } from './create-uom.command';
import type { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UnitOfMeasure } from '@/catalog/units-of-measure/domain/entities/unit-of-measure.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';

@CommandHandler(CreateUomCommand)
export class CreateUomHandler implements ICommandHandler<CreateUomCommand> {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly repository: IUnitOfMeasureRepository,
  ) {}

  async execute(command: CreateUomCommand): Promise<UnitOfMeasure> {
    const existing = await this.repository.findByCode(command.code);
    if (existing) {
      throw new BusinessRuleException(
        `Ya existe una unidad de medida con el código "${command.code}"`,
      );
    }

    const uom = new UnitOfMeasure({
      id: randomUUID(),
      code: command.code.toUpperCase().trim(),
      name: command.name.trim(),
      isActive: command.isActive ?? true,
      allowDecimals: command.allowDecimals ?? true,
      createdById: command.createdById,
    });

    uom.validate();

    return this.repository.save(uom);
  }
}
