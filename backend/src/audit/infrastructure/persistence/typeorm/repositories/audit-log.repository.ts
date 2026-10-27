import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuditRepository } from '../../../../domain/repositories/audit-log.repository.interface';
import { AuditLogOrmEntity } from '../entities/audit-log.orm-entity';
import { QueryAuditLogsDto } from '../../../../presentation/http/dto/query-audit-logs.dto';

@Injectable()
export class AuditRepository implements IAuditRepository {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly repository: Repository<AuditLogOrmEntity>,
  ) {}

  create(data: Partial<AuditLogOrmEntity>): AuditLogOrmEntity {
    return this.repository.create(data);
  }

  async save(entity: AuditLogOrmEntity): Promise<AuditLogOrmEntity> {
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<AuditLogOrmEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAll(
    query: QueryAuditLogsDto,
  ): Promise<[AuditLogOrmEntity[], number]> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));
    const skip = (page - 1) * limit;

    const qb = this.repository.createQueryBuilder('log');

    if (query.search) {
      qb.andWhere(
        '(LOWER(log.description) LIKE LOWER(:search) OR LOWER(log.userEmail) LIKE LOWER(:search) OR LOWER(log.userName) LIKE LOWER(:search) OR LOWER(log.model) LIKE LOWER(:search) OR LOWER(log.action) LIKE LOWER(:search) OR LOWER(log.entityId) LIKE LOWER(:search) OR LOWER(log.endpoint) LIKE LOWER(:search))',
        { search: `%${query.search.trim()}%` },
      );
    }

    if (query.model) {
      qb.andWhere('LOWER(log.model) = LOWER(:model)', {
        model: query.model.trim(),
      });
    }

    if (query.action) {
      qb.andWhere('LOWER(log.action) = LOWER(:action)', {
        action: query.action.trim(),
      });
    }

    if (query.status) {
      qb.andWhere('log.status = :status', {
        status: query.status.toUpperCase(),
      });
    }

    if (query.userId) {
      qb.andWhere('log.userId = :userId', { userId: query.userId });
    }

    if (query.startDate) {
      qb.andWhere('log.createdAt >= :startDate', {
        startDate: new Date(query.startDate),
      });
    }

    if (query.endDate) {
      qb.andWhere('log.createdAt <= :endDate', {
        endDate: new Date(query.endDate),
      });
    }

    qb.orderBy('log.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    return qb.getManyAndCount();
  }

  async getStats() {
    try {
      const total = await this.repository.count();

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = await this.repository
        .createQueryBuilder('log')
        .where('log.createdAt >= :today', { today })
        .getCount();

      const creates = await this.repository.count({
        where: { action: 'CREATE' },
      });
      const updates = await this.repository.count({
        where: { action: 'UPDATE' },
      });
      const deletes = await this.repository.count({
        where: { action: 'DELETE' },
      });
      const failed = await this.repository.count({
        where: { status: 'FAILED' },
      });

      return {
        total,
        todayCount,
        creates,
        updates,
        deletes,
        failed,
      };
    } catch {
      return {
        total: 0,
        todayCount: 0,
        creates: 0,
        updates: 0,
        deletes: 0,
        failed: 0,
      };
    }
  }
}
