import { AuditLogOrmEntity } from '../../infrastructure/persistence/typeorm/entities/audit-log.orm-entity';
import { QueryAuditLogsDto } from '../../presentation/http/dto/query-audit-logs.dto';

export interface IAuditRepository {
  save(entity: AuditLogOrmEntity): Promise<AuditLogOrmEntity>;
  create(data: Partial<AuditLogOrmEntity>): AuditLogOrmEntity;
  findAll(query: QueryAuditLogsDto): Promise<[AuditLogOrmEntity[], number]>;
  findById(id: string): Promise<AuditLogOrmEntity | null>;
  getStats(): Promise<{
    total: number;
    todayCount: number;
    creates: number;
    updates: number;
    deletes: number;
    failed: number;
  }>;
}
