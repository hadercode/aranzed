import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from '../../domain/events/user-registered.event';
import { Logger } from '@nestjs/common';

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredEventHandler implements IEventHandler<UserRegisteredEvent> {
  private readonly logger = new Logger(UserRegisteredEventHandler.name);

  handle(event: UserRegisteredEvent) {
    this.logger.log(
      `[Event-Driven] User Registered: ${event.email} (${event.userId})`,
    );
    // Here you can implement external events dispatch, send welcome email, etc.
  }
}
