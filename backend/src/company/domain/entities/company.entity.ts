import { BaseEntity } from '../../../core/domain/base.entity';

export class Company extends BaseEntity {
  identificationNumber: string;
  legalName: string;
  tradeName?: string;
  slogan?: string;

  // Contact
  phone?: string;
  secondaryPhone?: string;
  email?: string;
  website?: string;

  // Address
  address?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Currency & Region
  currencyCode: string;
  currencySymbol: string;
  currencyPosition: string; // 'left' | 'right'
  decimalPlaces: number;
  timezone: string;
  dateFormat: string;

  // Email Config
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  smtpSecure?: boolean;
  smtpFromName?: string;
  smtpFromEmail?: string;

  // Branding
  logoUrl?: string;
  logoDarkUrl?: string;
  faviconUrl?: string;

  // Legal / Invoicing
  taxRegime?: string;
  footerNotes?: string;

  constructor(partial: Partial<Company>) {
    super();
    Object.assign(this, partial);
    this.currencyCode = this.currencyCode || 'USD';
    this.currencySymbol = this.currencySymbol || '$';
    this.currencyPosition = this.currencyPosition || 'left';
    this.decimalPlaces =
      this.decimalPlaces !== undefined ? this.decimalPlaces : 2;
    this.timezone = this.timezone || 'UTC';
    this.dateFormat = this.dateFormat || 'YYYY-MM-DD';
  }
}
