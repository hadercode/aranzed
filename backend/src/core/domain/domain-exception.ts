import { BadRequestException, NotFoundException } from '@nestjs/common';

export class BusinessRuleException extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleException';
  }
}

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, id?: string) {
    super(
      id
        ? `${entityName} con ID '${id}' no fue encontrado`
        : `${entityName} no fue encontrado`,
    );
    this.name = 'EntityNotFoundException';
  }
}
