import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICompanyRepository } from '../../../../domain/repositories/company.repository.interface';
import { Company } from '../../../../domain/entities/company.entity';
import { CompanyOrmEntity } from '../entities/company.orm-entity';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly repository: Repository<CompanyOrmEntity>,
  ) {}

  async get(): Promise<Company | null> {
    const ormEntity = await this.repository.find({
      order: { createdAt: 'ASC' },
      take: 1,
    });

    if (!ormEntity || ormEntity.length === 0) {
      return null;
    }

    return this.toDomain(ormEntity[0]);
  }

  async save(company: Company): Promise<Company> {
    const ormEntity = this.toOrm(company);
    const saved = await this.repository.save(ormEntity);
    return this.toDomain(saved);
  }

  private toDomain(orm: CompanyOrmEntity): Company {
    const entity = new Company({
      id: orm.id,
      identificationNumber: orm.identificationNumber,
      legalName: orm.legalName,
      tradeName: orm.tradeName ?? undefined,
      slogan: orm.slogan ?? undefined,
      phone: orm.phone ?? undefined,
      secondaryPhone: orm.secondaryPhone ?? undefined,
      email: orm.email ?? undefined,
      website: orm.website ?? undefined,
      address: orm.address ?? undefined,
      addressLine2: orm.addressLine2 ?? undefined,
      city: orm.city ?? undefined,
      state: orm.state ?? undefined,
      zipCode: orm.zipCode ?? undefined,
      country: orm.country ?? undefined,
      currencyCode: orm.currencyCode,
      currencySymbol: orm.currencySymbol,
      currencyPosition: orm.currencyPosition,
      decimalPlaces: orm.decimalPlaces,
      timezone: orm.timezone,
      dateFormat: orm.dateFormat,
      smtpHost: orm.smtpHost ?? undefined,
      smtpPort: orm.smtpPort ?? undefined,
      smtpUser: orm.smtpUser ?? undefined,
      smtpPassword: orm.smtpPassword ?? undefined,
      smtpSecure: orm.smtpSecure,
      smtpFromName: orm.smtpFromName ?? undefined,
      smtpFromEmail: orm.smtpFromEmail ?? undefined,
      logoUrl: orm.logoUrl ?? undefined,
      logoDarkUrl: orm.logoDarkUrl ?? undefined,
      faviconUrl: orm.faviconUrl ?? undefined,
      taxRegime: orm.taxRegime ?? undefined,
      footerNotes: orm.footerNotes ?? undefined,
    });
    entity.createdAt = orm.createdAt;
    entity.updatedAt = orm.updatedAt;
    return entity;
  }

  private toOrm(domain: Company): CompanyOrmEntity {
    const orm = new CompanyOrmEntity();
    orm.id = domain.id;
    orm.identificationNumber = domain.identificationNumber || '';
    orm.legalName = domain.legalName || 'Mi Empresa';
    orm.tradeName = domain.tradeName ?? null;
    orm.slogan = domain.slogan ?? null;
    orm.phone = domain.phone ?? null;
    orm.secondaryPhone = domain.secondaryPhone ?? null;
    orm.email = domain.email ?? null;
    orm.website = domain.website ?? null;
    orm.address = domain.address ?? null;
    orm.addressLine2 = domain.addressLine2 ?? null;
    orm.city = domain.city ?? null;
    orm.state = domain.state ?? null;
    orm.zipCode = domain.zipCode ?? null;
    orm.country = domain.country ?? null;
    orm.currencyCode = domain.currencyCode || 'USD';
    orm.currencySymbol = domain.currencySymbol || '$';
    orm.currencyPosition = domain.currencyPosition || 'left';
    orm.decimalPlaces =
      domain.decimalPlaces !== undefined ? domain.decimalPlaces : 2;
    orm.timezone = domain.timezone || 'UTC';
    orm.dateFormat = domain.dateFormat || 'YYYY-MM-DD';
    orm.smtpHost = domain.smtpHost ?? null;
    orm.smtpPort = domain.smtpPort ?? null;
    orm.smtpUser = domain.smtpUser ?? null;
    orm.smtpPassword = domain.smtpPassword ?? null;
    orm.smtpSecure = domain.smtpSecure ?? false;
    orm.smtpFromName = domain.smtpFromName ?? null;
    orm.smtpFromEmail = domain.smtpFromEmail ?? null;
    orm.logoUrl = domain.logoUrl ?? null;
    orm.logoDarkUrl = domain.logoDarkUrl ?? null;
    orm.faviconUrl = domain.faviconUrl ?? null;
    orm.taxRegime = domain.taxRegime ?? null;
    orm.footerNotes = domain.footerNotes ?? null;
    return orm;
  }
}
