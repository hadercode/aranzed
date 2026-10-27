import { PartialType } from '@nestjs/swagger';
import { CreateInventoryReasonDto } from './create-inventory-reason.dto';

export class UpdateInventoryReasonDto extends PartialType(
  CreateInventoryReasonDto,
) {}
