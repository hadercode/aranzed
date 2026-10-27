import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryReasonOrmEntity } from '@/inventory/reasons/infrastructure/persistence/typeorm/entities/inventory-reason.orm-entity';
import { CreateInventoryReasonDto } from '../../presentation/http/dto/create-inventory-reason.dto';
import { UpdateInventoryReasonDto } from '../../presentation/http/dto/update-inventory-reason.dto';

@Injectable()
export class InventoryReasonsService {
  constructor(
    @InjectRepository(InventoryReasonOrmEntity)
    private readonly reasonRepo: Repository<InventoryReasonOrmEntity>,
  ) {}

  async findAll(): Promise<InventoryReasonOrmEntity[]> {
    return this.reasonRepo.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<InventoryReasonOrmEntity> {
    const reason = await this.reasonRepo.findOne({ where: { id } });
    if (!reason) {
      throw new NotFoundException(
        `Motivo de inventario con ID ${id} no encontrado`,
      );
    }
    return reason;
  }

  async create(
    dto: CreateInventoryReasonDto,
    userId?: string,
  ): Promise<InventoryReasonOrmEntity> {
    const existing = await this.reasonRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new BadRequestException(`El motivo "${dto.name}" ya existe`);
    }

    const reason = this.reasonRepo.create({
      name: dto.name,
      type: dto.type,
      description: dto.description,
      createdById: userId,
    });

    return this.reasonRepo.save(reason);
  }

  async update(
    id: string,
    dto: UpdateInventoryReasonDto,
  ): Promise<InventoryReasonOrmEntity> {
    const reason = await this.findOne(id);

    if (dto.name && dto.name !== reason.name) {
      const existing = await this.reasonRepo.findOne({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`El nombre "${dto.name}" ya está en uso`);
      }
      reason.name = dto.name;
    }

    if (dto.type !== undefined) reason.type = dto.type;
    if (dto.description !== undefined) reason.description = dto.description;

    return this.reasonRepo.save(reason);
  }

  async remove(id: string): Promise<void> {
    const reason = await this.findOne(id);
    await this.reasonRepo.softRemove(reason);
  }
}
