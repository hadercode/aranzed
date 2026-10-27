import { Injectable, Inject, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IAuditRepository } from '../../domain/repositories/audit-log.repository.interface';
import { AuditLogOrmEntity } from '../../infrastructure/persistence/typeorm/entities/audit-log.orm-entity';
import { QueryAuditLogsDto } from '../../presentation/http/dto/query-audit-logs.dto';

const SENSITIVE_KEYS = [
  'password',
  'passwordhash',
  'passwordrecoverytoken',
  'smtppassword',
  'token',
  'refreshtoken',
  'secret',
  'authorization',
  'jwt',
];

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @Inject('IAuditRepository')
    private readonly auditRepo: IAuditRepository,
  ) {}

  /**
   * Sanitizes objects by masking sensitive information (passwords, tokens, etc.)
   */
  sanitizeData(data: any): any {
    if (!data) return data;
    if (typeof data !== 'object') return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = SENSITIVE_KEYS.some((s) => lowerKey.includes(s));

      if (isSensitive) {
        sanitized[key] = '[PROTEGIDO]';
      } else if (data[key] && typeof data[key] === 'object') {
        sanitized[key] = this.sanitizeData(data[key]);
      } else {
        sanitized[key] = data[key];
      }
    }
    return sanitized;
  }

  /**
   * Calculates diff between before and after states
   */
  calculateDiff(
    previous: Record<string, any> | null,
    next: Record<string, any> | null,
  ): Record<string, { from: any; to: any }> | null {
    if (!previous && !next) return null;
    const diff: Record<string, { from: any; to: any }> = {};

    const prevObj = previous || {};
    const nextObj = next || {};

    const allKeys = Array.from(
      new Set([...Object.keys(prevObj), ...Object.keys(nextObj)]),
    );

    // Exclude automatic timestamps from noisy diffs
    const ignoredKeys = ['updatedat', 'createdat'];

    for (const key of allKeys) {
      if (ignoredKeys.includes(key.toLowerCase())) continue;

      const val1 = prevObj[key];
      const val2 = nextObj[key];

      const str1 = JSON.stringify(val1);
      const str2 = JSON.stringify(val2);

      if (str1 !== str2) {
        diff[key] = {
          from: val1 !== undefined ? val1 : null,
          to: val2 !== undefined ? val2 : null,
        };
      }
    }

    return Object.keys(diff).length > 0 ? diff : null;
  }

  /**
   * Records a new audit log entry
   */
  async record(
    data: Partial<AuditLogOrmEntity>,
  ): Promise<AuditLogOrmEntity | null> {
    try {
      const sanitizedPrevious = data.previousState
        ? this.sanitizeData(data.previousState)
        : null;
      const sanitizedNext = data.newState
        ? this.sanitizeData(data.newState)
        : null;

      const computedChanges =
        data.changes ||
        (sanitizedPrevious && sanitizedNext
          ? this.calculateDiff(sanitizedPrevious, sanitizedNext)
          : null);

      const entity = this.auditRepo.create({
        id: data.id || randomUUID(),
        userId: data.userId || null,
        userEmail: data.userEmail || null,
        userName: data.userName || null,
        action: data.action || 'UNKNOWN',
        model: data.model || 'General',
        entityId: data.entityId ? String(data.entityId) : null,
        description: data.description || null,
        previousState: sanitizedPrevious,
        newState: sanitizedNext,
        changes: computedChanges ? this.sanitizeData(computedChanges) : null,
        ipAddress: data.ipAddress || '127.0.0.1',
        userAgent: data.userAgent || null,
        method: data.method || 'UNKNOWN',
        endpoint: data.endpoint || '/',
        statusCode: data.statusCode || 200,
        status: data.status || 'SUCCESS',
        errorMessage: data.errorMessage || null,
        durationMs: data.durationMs || 0,
        metadata: data.metadata ? this.sanitizeData(data.metadata) : null,
      });

      return await this.auditRepo.save(entity);
    } catch (err: any) {
      this.logger.error(
        `Failed to record audit log: ${err.message}`,
        err.stack,
      );
      return null;
    }
  }

  /**
   * Query logs with pagination, search and filters
   */
  async findAll(query: QueryAuditLogsDto) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, Math.min(100, query.limit || 20));

    const [items, total] = await this.auditRepo.findAll(query);
    const stats = await this.auditRepo.getStats();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      stats,
    };
  }

  /**
   * Find single log by ID
   */
  async findById(id: string): Promise<AuditLogOrmEntity | null> {
    return this.auditRepo.findById(id);
  }

  /**
   * Aggregate statistics for dashboard / metrics header
   */
  async getStats() {
    return this.auditRepo.getStats();
  }
}
