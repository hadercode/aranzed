import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyOrmEntity } from './infrastructure/persistence/typeorm/entities/company.orm-entity';
import { CompanyRepository } from './infrastructure/persistence/typeorm/repositories/company.repository';
import { CompanyController } from './presentation/http/controllers/company.controller';
import { GetCompanyHandler } from './application/queries/get-company/get-company.handler';
import { UpdateCompanyHandler } from './application/commands/update-company/update-company.handler';

const CommandHandlers = [UpdateCompanyHandler];
const QueryHandlers = [GetCompanyHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CompanyOrmEntity])],
  controllers: [CompanyController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: 'ICompanyRepository',
      useClass: CompanyRepository,
    },
  ],
  exports: ['ICompanyRepository'],
})
export class CompanyModule {}
