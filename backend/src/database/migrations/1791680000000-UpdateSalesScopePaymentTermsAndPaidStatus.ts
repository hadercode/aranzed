import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSalesScopePaymentTermsAndPaidStatus1791680000000 implements MigrationInterface {
  name = 'UpdateSalesScopePaymentTermsAndPaidStatus1791680000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "sales"
        ADD COLUMN "payment_term" character varying(20) NOT NULL DEFAULT 'CONTADO',
        ADD COLUMN "due_date" TIMESTAMP,
        ADD COLUMN "paid_status" character varying(20) NOT NULL DEFAULT 'PENDIENTE';
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_sales_payment_term" ON "sales" ("payment_term")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_paid_status" ON "sales" ("paid_status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_sales_paid_status"`);
    await queryRunner.query(`DROP INDEX "IDX_sales_payment_term"`);

    await queryRunner.query(`
      ALTER TABLE "sales"
        DROP COLUMN "paid_status",
        DROP COLUMN "due_date",
        DROP COLUMN "payment_term";
    `);
  }
}
