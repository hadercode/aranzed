import { BaseEntity } from '../../../core/domain/base.entity';

export class Permission extends BaseEntity {
  action: string;
  resource: string;

  constructor(id: string, action: string, resource: string) {
    super();
    this.id = id;
    this.action = action;
    this.resource = resource;
  }
}
