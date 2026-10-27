import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DataSource } from 'typeorm';
import { AuditService } from '../services/audit.service';
import {
  matchAuditRule,
  ResolvedAuditInfo,
} from '../../infrastructure/config/audit-rules.config';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    if (!req) {
      return next.handle();
    }

    const method = (req.method || 'GET').toUpperCase();
    const url = req.originalUrl || req.url || '';

    // Ignore pre-flight OPTIONS, static files, and audit log endpoints to prevent recursion loops
    if (
      method === 'OPTIONS' ||
      url.startsWith('/uploads') ||
      url.startsWith('/audit') ||
      url.includes('favicon.ico')
    ) {
      return next.handle();
    }

    // Resolve model, action, description and entity config declaratively from AUDIT_RULES registry
    const ruleInfo = matchAuditRule(req, method, url);
    const { model, action, description, entityId } = ruleInfo;

    const startTime = Date.now();
    const ipAddress = this.extractIp(req);
    const userAgent = (req.headers && req.headers['user-agent']) || 'Unknown';

    // Snapshot previous state before handler execution for modifications
    let previousState: any = null;
    if (
      ['PUT', 'PATCH', 'DELETE'].includes(method) ||
      url.includes('/profile/avatar')
    ) {
      try {
        previousState = await this.fetchEntitySnapshot(ruleInfo, req);
      } catch (e: any) {
        this.logger.debug(
          `Could not snapshot previous state for ${model}: ${e.message}`,
        );
      }
    }

    return next.handle().pipe(
      tap({
        next: async (responseBody) => {
          const durationMs = Date.now() - startTime;
          const statusCode = res.statusCode || (method === 'POST' ? 201 : 200);

          let newState: any = null;
          if (method === 'DELETE') {
            newState = null;
          } else if (['PUT', 'PATCH'].includes(method)) {
            try {
              newState = await this.fetchEntitySnapshot(
                ruleInfo,
                req,
                responseBody,
              );
            } catch {
              newState = responseBody;
            }
          } else if (method === 'POST') {
            newState = responseBody;
          }

          // User info
          const user = req.user;
          const userId =
            user?.userId ||
            (responseBody?.user && responseBody.user.id) ||
            null;
          const userEmail =
            user?.email ||
            req.body?.email ||
            (responseBody?.user && responseBody.user.email) ||
            null;
          const userName = user?.firstName
            ? `${user.firstName} ${user.lastName || ''}`.trim()
            : null;

          // Record audit log asynchronously
          this.auditService
            .record({
              userId,
              userEmail,
              userName,
              action,
              model,
              entityId: entityId ? String(entityId) : null,
              description,
              previousState,
              newState,
              ipAddress,
              userAgent,
              method,
              endpoint: url,
              statusCode,
              status: 'SUCCESS',
              durationMs,
              metadata: {
                query: req.query,
                params: req.params,
                body: this.auditService.sanitizeData(req.body),
              },
            })
            .catch((err) => {
              this.logger.error(`Error saving audit log: ${err.message}`);
            });
        },
      }),
      catchError((error) => {
        const durationMs = Date.now() - startTime;
        const statusCode = error.status || error.statusCode || 500;

        const user = req.user;
        const userId = user?.userId || null;
        const userEmail = user?.email || req.body?.email || null;

        this.auditService
          .record({
            userId,
            userEmail,
            action,
            model,
            entityId: entityId ? String(entityId) : null,
            description: `${description} [FALLIDO]`,
            previousState,
            newState: null,
            ipAddress,
            userAgent,
            method,
            endpoint: url,
            statusCode,
            status: 'FAILED',
            errorMessage: error.message || 'Error en la petición',
            durationMs,
            metadata: {
              query: req.query,
              params: req.params,
              body: this.auditService.sanitizeData(req.body),
            },
          })
          .catch((err) => {
            this.logger.error(`Error saving failed audit log: ${err.message}`);
          });

        throw error;
      }),
    );
  }

  private extractIp(req: any): string {
    const forwarded = req.headers && req.headers['x-forwarded-for'];
    if (forwarded) {
      const parts = (
        typeof forwarded === 'string' ? forwarded : forwarded[0]
      ).split(',');
      return parts[0].trim();
    }
    return req.socket?.remoteAddress || req.ip || '127.0.0.1';
  }

  private async fetchEntitySnapshot(
    ruleInfo: ResolvedAuditInfo,
    req: any,
    fallback?: any,
  ): Promise<any> {
    if (!ruleInfo.entityConfig) {
      return fallback || null;
    }

    try {
      const { target, relations, isSingleton } = ruleInfo.entityConfig;
      const repo = this.dataSource.getRepository(target);

      if (isSingleton) {
        return (await repo.findOne({ where: {} })) || null;
      }

      const id = ruleInfo.entityId;
      if (id) {
        return (await repo.findOne({ where: { id }, relations })) || null;
      }
    } catch (err: any) {
      this.logger.warn(
        `Failed snapshot query for ${ruleInfo.model}: ${err.message}`,
      );
    }

    return fallback || null;
  }
}
