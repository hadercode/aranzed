import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryReasonOrmEntity } from './infrastructure/persistence/typeorm/entities/inventory-reason.orm-entity';
import { InventoryReasonsService } from './application/services/inventory-reasons.service';
import { InventoryReasonsController } from './presentation/http/controllers/inventory-reasons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryReasonOrmEntity])],
  controllers: [InventoryReasonsController],
  providers: [InventoryReasonsService],
  exports: [InventoryReasonsService, TypeOrmModule],
})
export class InventoryReasonsModule {}
