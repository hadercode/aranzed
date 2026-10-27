import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
export class CompanyOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  identificationNumber: string;

  @Column({ type: 'varchar', length: 255, default: 'Mi Empresa' })
  legalName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tradeName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  slogan: string | null;

  // Contact
  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  secondaryPhone: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  website: string | null;

  // Address
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  addressLine2: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  zipCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string | null;

  // Currency & Region
  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currencyCode: string;

  @Column({ type: 'varchar', length: 10, default: '$' })
  currencySymbol: string;

  @Column({ type: 'varchar', length: 10, default: 'left' })
  currencyPosition: string;

  @Column({ type: 'int', default: 2 })
  decimalPlaces: number;

  @Column({ type: 'varchar', length: 100, default: 'UTC' })
  timezone: string;

  @Column({ type: 'varchar', length: 30, default: 'YYYY-MM-DD' })
  dateFormat: string;

  // Email Config (SMTP)
  @Column({ type: 'varchar', length: 200, nullable: true })
  smtpHost: string | null;

  @Column({ type: 'int', nullable: true })
  smtpPort: number | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  smtpUser: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  smtpPassword: string | null;

  @Column({ type: 'boolean', default: false })
  smtpSecure: boolean;

  @Column({ type: 'varchar', length: 150, nullable: true })
  smtpFromName: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  smtpFromEmail: string | null;

  // Branding
  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoDarkUrl: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  faviconUrl: string | null;

  // Legal / Invoicing
  @Column({ type: 'varchar', length: 150, nullable: true })
  taxRegime: string | null;

  @Column({ type: 'text', nullable: true })
  footerNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
