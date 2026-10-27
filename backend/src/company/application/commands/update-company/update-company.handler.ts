import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCompanyCommand } from './update-company.command';
import { Inject } from '@nestjs/common';
import type { ICompanyRepository } from '../../../domain/repositories/company.repository.interface';
import { Company } from '../../../domain/entities/company.entity';
import { randomUUID } from 'crypto';

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyHandler implements ICommandHandler<UpdateCompanyCommand> {
  constructor(
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(command: UpdateCompanyCommand): Promise<Company> {
    let company = await this.companyRepository.get();

    if (!company) {
      company = new Company({
        id: randomUUID(),
        identificationNumber: '',
        legalName: 'Mi Empresa',
      });
    }

    const { data } = command;
    if (data.identificationNumber !== undefined)
      company.identificationNumber = data.identificationNumber;
    if (data.legalName !== undefined) company.legalName = data.legalName;
    if (data.tradeName !== undefined) company.tradeName = data.tradeName;
    if (data.slogan !== undefined) company.slogan = data.slogan;
    if (data.phone !== undefined) company.phone = data.phone;
    if (data.secondaryPhone !== undefined)
      company.secondaryPhone = data.secondaryPhone;
    if (data.email !== undefined) company.email = data.email;
    if (data.website !== undefined) company.website = data.website;
    if (data.address !== undefined) company.address = data.address;
    if (data.addressLine2 !== undefined)
      company.addressLine2 = data.addressLine2;
    if (data.city !== undefined) company.city = data.city;
    if (data.state !== undefined) company.state = data.state;
    if (data.zipCode !== undefined) company.zipCode = data.zipCode;
    if (data.country !== undefined) company.country = data.country;
    if (data.currencyCode !== undefined)
      company.currencyCode = data.currencyCode;
    if (data.currencySymbol !== undefined)
      company.currencySymbol = data.currencySymbol;
    if (data.currencyPosition !== undefined)
      company.currencyPosition = data.currencyPosition;
    if (data.decimalPlaces !== undefined)
      company.decimalPlaces = data.decimalPlaces;
    if (data.timezone !== undefined) company.timezone = data.timezone;
    if (data.dateFormat !== undefined) company.dateFormat = data.dateFormat;
    if (data.smtpHost !== undefined) company.smtpHost = data.smtpHost;
    if (data.smtpPort !== undefined) company.smtpPort = data.smtpPort;
    if (
      data.smtpPassword !== undefined &&
      data.smtpPassword.trim() !== '' &&
      data.smtpPassword !== '********'
    ) {
      company.smtpPassword = data.smtpPassword;
    }
    if (data.smtpFromName !== undefined)
      company.smtpFromName = data.smtpFromName;
    if (data.smtpFromEmail !== undefined)
      company.smtpFromEmail = data.smtpFromEmail;
    if (data.logoUrl !== undefined) company.logoUrl = data.logoUrl;
    if (data.logoDarkUrl !== undefined) company.logoDarkUrl = data.logoDarkUrl;
    if (data.faviconUrl !== undefined) company.faviconUrl = data.faviconUrl;
    if (data.taxRegime !== undefined) company.taxRegime = data.taxRegime;
    if (data.footerNotes !== undefined) company.footerNotes = data.footerNotes;

    return await this.companyRepository.save(company);
  }
}
