import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBalanceColumnsToSalesTable1791740000000 implements MigrationInterface {
  name = 'AddBalanceColumnsToSalesTable1791740000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sales"
        ADD COLUMN IF NOT EXISTS "balance" numeric(14,4) NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "balance_local" numeric(14,4) NOT NULL DEFAULT 0;
    `);

    // Sincronizar el saldo inicial a partir del total y del monto pagado
    await queryRunner.query(`
      UPDATE "sales"
      SET "balance" = CASE 
            WHEN "paid_status" = 'PAGADO' THEN 0
            ELSE GREATEST(0, "total" - "paid_amount")
          END,
          "balance_local" = CASE 
            WHEN "paid_status" = 'PAGADO' THEN 0
            ELSE GREATEST(0, "total_local" - "paid_amount_local")
          END;
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_sales_balance" ON "sales" ("balance");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sales_balance"`);
    await queryRunner.query(`
      ALTER TABLE "sales"
        DROP COLUMN IF EXISTS "balance_local",
        DROP COLUMN IF EXISTS "balance";
    `);
  }
}

