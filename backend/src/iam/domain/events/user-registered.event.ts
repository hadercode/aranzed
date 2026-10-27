import { DomainEvent } from '../../../core/domain/domain-event';

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {
    super(UserRegisteredEvent.name);
  }
}
