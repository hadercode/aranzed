import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDualCurrencyToMaterialPurchases1791640000000 implements MigrationInterface {
  name = 'AddDualCurrencyToMaterialPurchases1791640000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Columnas en material_purchases
    await queryRunner.query(`
      ALTER TABLE "material_purchases"
      ADD COLUMN "exchange_rate" numeric(14,4) NOT NULL DEFAULT 1.0000,
      ADD COLUMN "functional_currency" character varying(10) NOT NULL DEFAULT 'USD',
      ADD COLUMN "local_currency" character varying(10) NOT NULL DEFAULT 'VES',
      ADD COLUMN "subtotal_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
      ADD COLUMN "tax_amount_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
      ADD COLUMN "total_local" numeric(14,4) NOT NULL DEFAULT 0.0000
    `);

    // 2. Columnas en material_purchase_items
    await queryRunner.query(`
      ALTER TABLE "material_purchase_items"
      ADD COLUMN "currency_symbol_functional" character varying(5) NOT NULL DEFAULT '$',
      ADD COLUMN "currency_symbol_local" character varying(5) NOT NULL DEFAULT 'Bs.',
      ADD COLUMN "unit_cost_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
      ADD COLUMN "subtotal_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
      ADD COLUMN "tax_amount_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
      ADD COLUMN "total_local" numeric(14,4) NOT NULL DEFAULT 0.0000
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "material_purchase_items"
      DROP COLUMN "total_local",
      DROP COLUMN "tax_amount_local",
      DROP COLUMN "subtotal_local",
      DROP COLUMN "unit_cost_local",
      DROP COLUMN "currency_symbol_local",
      DROP COLUMN "currency_symbol_functional"
    `);

    await queryRunner.query(`
      ALTER TABLE "material_purchases"
      DROP COLUMN "total_local",
      DROP COLUMN "tax_amount_local",
      DROP COLUMN "subtotal_local",
      DROP COLUMN "local_currency",
      DROP COLUMN "functional_currency",
      DROP COLUMN "exchange_rate"
    `);
  }
}
