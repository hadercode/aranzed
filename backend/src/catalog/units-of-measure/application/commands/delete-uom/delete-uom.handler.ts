import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteUomCommand } from './delete-uom.command';
import type { IUnitOfMeasureRepository } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { UNIT_OF_MEASURE_REPOSITORY_TOKEN } from '@/catalog/units-of-measure/domain/repositories/unit-of-measure.repository.interface';
import { EntityNotFoundException } from '@/core/domain/domain-exception';

@CommandHandler(DeleteUomCommand)
export class DeleteUomHandler implements ICommandHandler<DeleteUomCommand> {
  constructor(
    @Inject(UNIT_OF_MEASURE_REPOSITORY_TOKEN)
    private readonly repository: IUnitOfMeasureRepository,
  ) {}

  async execute(command: DeleteUomCommand): Promise<void> {
    const uom = await this.repository.findById(command.id);
    if (!uom) {
      throw new EntityNotFoundException('Unidad de Medida', command.id);
    }
    await this.repository.delete(command.id);
  }
}
