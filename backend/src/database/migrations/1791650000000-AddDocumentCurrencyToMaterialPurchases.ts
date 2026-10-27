import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDocumentCurrencyToMaterialPurchases1791650000000 implements MigrationInterface {
  name = 'AddDocumentCurrencyToMaterialPurchases1791650000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "material_purchases"
      ADD COLUMN "document_currency" character varying(10) NOT NULL DEFAULT 'USD'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "material_purchases"
      DROP COLUMN "document_currency"
    `);
  }
}
