import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseOrmEntity } from './infrastructure/persistence/typeorm/entities/warehouse.orm-entity';
import { WarehouseResponsibleOrmEntity } from './infrastructure/persistence/typeorm/entities/warehouse-responsible.orm-entity';
import { WarehousesService } from './application/services/warehouses.service';
import { WarehousesController } from './presentation/http/controllers/warehouses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarehouseOrmEntity,
      WarehouseResponsibleOrmEntity,
    ]),
  ],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService, TypeOrmModule],
})
export class WarehousesModule {}
