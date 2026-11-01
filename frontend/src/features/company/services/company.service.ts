import { ApiClient } from '@/lib/api-client';

export interface Company {
  id: string;
  identificationNumber: string;
  legalName: string;
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
  currencyCode: string;
  currencySymbol: string;
  currencyPosition: string;
  decimalPlaces: number;
  timezone: string;
  dateFormat: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export const companyService = {
  async getCompany(): Promise<Company> {
    return ApiClient.get<Company>('/company');
  },

  async updateCompany(data: Partial<Company>): Promise<Company> {
    return ApiClient.put<Company>('/company', data);
  },

  async uploadLogo(file: File): Promise<{ message: string; logoUrl: string; company: Company }> {
    const formData = new FormData();
    formData.append('file', file);
    return ApiClient.post<{ message: string; logoUrl: string; company: Company }>('/company/logo', formData);
  },
};

