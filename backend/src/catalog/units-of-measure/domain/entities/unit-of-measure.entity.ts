import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';

export class UnitOfMeasure extends BaseEntity {
  code: string;
  name: string;
  isActive: boolean;
  allowDecimals: boolean;
  createdById?: string | null;
  deletedAt?: Date | null;

  constructor(partial: Partial<UnitOfMeasure>) {
    super();
    Object.assign(this, partial);
    this.isActive = partial.isActive !== undefined ? partial.isActive : true;
    this.allowDecimals =
      partial.allowDecimals !== undefined ? partial.allowDecimals : true;
  }

  validate(): void {
    if (!this.code || this.code.trim().length === 0) {
      throw new BusinessRuleException(
        'El código de la unidad de medida es obligatorio',
      );
    }
    if (this.code.length > 10) {
      throw new BusinessRuleException(
        'El código no puede superar 10 caracteres',
      );
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessRuleException(
        'El nombre de la unidad de medida es obligatorio',
      );
    }
    if (this.name.length > 50) {
      throw new BusinessRuleException(
        'El nombre no puede superar 50 caracteres',
      );
    }
  }
}
