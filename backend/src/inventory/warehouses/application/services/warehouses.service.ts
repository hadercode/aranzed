import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WarehouseOrmEntity } from '@/inventory/warehouses/infrastructure/persistence/typeorm/entities/warehouse.orm-entity';
import { WarehouseResponsibleOrmEntity } from '@/inventory/warehouses/infrastructure/persistence/typeorm/entities/warehouse-responsible.orm-entity';
import { CreateWarehouseDto } from '../../presentation/http/dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../../presentation/http/dto/update-warehouse.dto';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(WarehouseOrmEntity)
    private readonly warehouseRepo: Repository<WarehouseOrmEntity>,
    @InjectRepository(WarehouseResponsibleOrmEntity)
    private readonly responsibleRepo: Repository<WarehouseResponsibleOrmEntity>,
  ) {}

  async findAll(): Promise<WarehouseOrmEntity[]> {
    return this.warehouseRepo.find({
      relations: { responsibles: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<WarehouseOrmEntity> {
    const warehouse = await this.warehouseRepo.findOne({
      where: { id },
      relations: { responsibles: true },
    });
    if (!warehouse) {
      throw new NotFoundException(`Almacén con ID ${id} no encontrado`);
    }
    return warehouse;
  }

  async create(
    dto: CreateWarehouseDto,
    userId?: string,
  ): Promise<WarehouseOrmEntity> {
    const existing = await this.warehouseRepo.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new BadRequestException(
        `El almacén con código ${dto.code} ya existe`,
      );
    }

    if (dto.isSalesWarehouse) {
      // Desmarcar otro almacén de ventas previo si existe
      await this.warehouseRepo.update(
        { isSalesWarehouse: true },
        { isSalesWarehouse: false },
      );
    }

    const warehouse = this.warehouseRepo.create({
      code: dto.code,
      name: dto.name,
      location: dto.location,
      isActive: dto.isActive ?? true,
      isSalesWarehouse: dto.isSalesWarehouse ?? false,
      createdById: userId,
      responsibles:
        dto.responsibles?.map((r) =>
          this.responsibleRepo.create({
            userId: r.userId,
            isPrimary: r.isPrimary ?? false,
            createdById: userId,
          }),
        ) || [],
    });

    return this.warehouseRepo.save(warehouse);
  }

  async update(
    id: string,
    dto: UpdateWarehouseDto,
    userId?: string,
  ): Promise<WarehouseOrmEntity> {
    const warehouse = await this.findOne(id);

    if (dto.code && dto.code !== warehouse.code) {
      const existing = await this.warehouseRepo.findOne({
        where: { code: dto.code },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          `El código ${dto.code} ya está en uso por otro almacén`,
        );
      }
      warehouse.code = dto.code;
    }

    if (dto.name !== undefined) warehouse.name = dto.name;
    if (dto.location !== undefined) warehouse.location = dto.location;
    if (dto.isActive !== undefined) warehouse.isActive = dto.isActive;

    if (dto.isSalesWarehouse !== undefined) {
      if (dto.isSalesWarehouse) {
        await this.warehouseRepo.update(
          { isSalesWarehouse: true },
          { isSalesWarehouse: false },
        );
      }
      warehouse.isSalesWarehouse = dto.isSalesWarehouse;
    }

    if (dto.responsibles !== undefined) {
      await this.responsibleRepo.delete({ warehouseId: id });
      warehouse.responsibles = dto.responsibles.map((r) =>
        this.responsibleRepo.create({
          warehouseId: id,
          userId: r.userId,
          isPrimary: r.isPrimary ?? false,
          createdById: userId,
        }),
      );
    }

    return this.warehouseRepo.save(warehouse);
  }

  async remove(id: string): Promise<void> {
    const warehouse = await this.findOne(id);
    await this.warehouseRepo.softRemove(warehouse);
  }
}
