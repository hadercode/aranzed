import { Company } from '../entities/company.entity';

export interface ICompanyRepository {
  get(): Promise<Company | null>;
  save(company: Company): Promise<Company>;
}
