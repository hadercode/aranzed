export class UpdateCompanyCommand {
  constructor(
    public readonly data: {
      identificationNumber?: string;
      legalName?: string;
      tradeName?: string;
      slogan?: string;
      phone?: string;
      secondaryPhone?: string;
      email?: string;
      website?: string;
      address?: string;
      addressLine2?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      currencyCode?: string;
      currencySymbol?: string;
      currencyPosition?: string;
      decimalPlaces?: number;
      timezone?: string;
      dateFormat?: string;
      smtpHost?: string;
      smtpPort?: number;
      smtpUser?: string;
      smtpPassword?: string;
      smtpSecure?: boolean;
      smtpFromName?: string;
      smtpFromEmail?: string;
      logoUrl?: string;
      logoDarkUrl?: string;
      faviconUrl?: string;
      taxRegime?: string;
      footerNotes?: string;
    },
  ) {}
}
