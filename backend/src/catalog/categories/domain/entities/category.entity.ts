import { BaseEntity } from '@/core/domain/base.entity';
import { BusinessRuleException } from '@/core/domain/domain-exception';

export class Category extends BaseEntity {
  name: string;
  parentId?: string | null;
  path: string;
  isActive: boolean;
  createdById?: string | null;
  deletedAt?: Date | null;

  constructor(partial: Partial<Category>) {
    super();
    Object.assign(this, partial);
    this.isActive = partial.isActive !== undefined ? partial.isActive : true;
    this.path = partial.path || '';
  }

  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new BusinessRuleException(
        'El nombre de la categoría es obligatorio',
      );
    }
    if (this.name.length > 100) {
      throw new BusinessRuleException(
        'El nombre de la categoría no puede superar 100 caracteres',
      );
    }
    if (this.parentId && this.parentId === this.id) {
      throw new BusinessRuleException(
        'Una categoría no puede ser su propio padre',
      );
    }
  }

  updatePath(parentPath?: string): void {
    const trimmedName = this.name.trim();
    if (parentPath && parentPath.length > 0) {
      this.path = `${parentPath}/${trimmedName}`;
    } else {
      this.path = trimmedName;
    }
  }
}
