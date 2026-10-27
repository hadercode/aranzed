import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCompanyQuery } from './get-company.query';
import { Inject } from '@nestjs/common';
import type { ICompanyRepository } from '../../../domain/repositories/company.repository.interface';
import { Company } from '../../../domain/entities/company.entity';
import { randomUUID } from 'crypto';

@QueryHandler(GetCompanyQuery)
export class GetCompanyHandler implements IQueryHandler<GetCompanyQuery> {
  constructor(
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(): Promise<Company> {
    let company = await this.companyRepository.get();

    if (!company) {
      company = new Company({
        id: randomUUID(),
        identificationNumber: '',
        legalName: 'Mi Empresa',
        tradeName: 'Mi Empresa',
        slogan: 'Liderando el cambio',
        currencyCode: 'USD',
        currencySymbol: '$',
        currencyPosition: 'left',
        decimalPlaces: 2,
        timezone: 'UTC',
        dateFormat: 'YYYY-MM-DD',
      });
      company = await this.companyRepository.save(company);
    }

    return company;
  }
}
