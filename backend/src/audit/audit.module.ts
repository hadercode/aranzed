import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogOrmEntity } from './infrastructure/persistence/typeorm/entities/audit-log.orm-entity';
import { AuditRepository } from './infrastructure/persistence/typeorm/repositories/audit-log.repository';
import { AuditService } from './application/services/audit.service';
import { AuditInterceptor } from './application/interceptors/audit.interceptor';
import { AuditController } from './presentation/http/controllers/audit.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditLogOrmEntity])],
  controllers: [AuditController],
  providers: [
    AuditService,
    {
      provide: 'IAuditRepository',
      useClass: AuditRepository,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [AuditService, 'IAuditRepository'],
})
export class AuditModule {}
