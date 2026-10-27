import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompanyTable1791570000000 implements MigrationInterface {
  name = 'CreateCompanyTable1791570000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "companies" (
                "id" uuid NOT NULL,
                "identificationNumber" character varying(100) NOT NULL DEFAULT '',
                "legalName" character varying(255) NOT NULL DEFAULT 'Mi Empresa',
                "tradeName" character varying(255),
                "slogan" character varying(255),
                "phone" character varying(50),
                "secondaryPhone" character varying(50),
                "email" character varying(150),
                "website" character varying(200),
                "address" character varying(255),
                "addressLine2" character varying(255),
                "city" character varying(100),
                "state" character varying(100),
                "zipCode" character varying(30),
                "country" character varying(100),
                "currencyCode" character varying(10) NOT NULL DEFAULT 'USD',
                "currencySymbol" character varying(10) NOT NULL DEFAULT '$',
                "currencyPosition" character varying(10) NOT NULL DEFAULT 'left',
                "decimalPlaces" integer NOT NULL DEFAULT 2,
                "timezone" character varying(100) NOT NULL DEFAULT 'UTC',
                "dateFormat" character varying(30) NOT NULL DEFAULT 'YYYY-MM-DD',
                "smtpHost" character varying(200),
                "smtpPort" integer,
                "smtpUser" character varying(150),
                "smtpPassword" character varying(255),
                "smtpSecure" boolean NOT NULL DEFAULT false,
                "smtpFromName" character varying(150),
                "smtpFromEmail" character varying(150),
                "logoUrl" character varying(500),
                "logoDarkUrl" character varying(500),
                "faviconUrl" character varying(500),
                "taxRegime" character varying(150),
                "footerNotes" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_companies_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "companies"`);
  }
}
