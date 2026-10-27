import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateUomCommand } from './update-uom.command';
import type { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UnitOfMeasure } from '@/catalog/units-of-measure/domain/entities/unit-of-measure.entity';
import {
  BusinessRuleException,
  EntityNotFoundException,
} from '@/core/domain/domain-exception';

@CommandHandler(UpdateUomCommand)
export class UpdateUomHandler implements ICommandHandler<UpdateUomCommand> {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly repository: IUnitOfMeasureRepository,
  ) {}

  async execute(command: UpdateUomCommand): Promise<UnitOfMeasure> {
    const { id, data } = command;
    const uom = await this.repository.findById(id);
    if (!uom) {
      throw new EntityNotFoundException('Unidad de Medida', id);
    }

    if (data.code !== undefined && data.code !== uom.code) {
      const existing = await this.repository.findByCode(data.code);
      if (existing && existing.id !== id) {
        throw new BusinessRuleException(
          `Ya existe una unidad de medida con el código "${data.code}"`,
        );
      }
      uom.code = data.code.toUpperCase().trim();
    }

    if (data.name !== undefined) uom.name = data.name.trim();
    if (data.isActive !== undefined) uom.isActive = data.isActive;
    if (data.allowDecimals !== undefined)
      uom.allowDecimals = data.allowDecimals;

    uom.validate();

    return this.repository.save(uom);
  }
}
