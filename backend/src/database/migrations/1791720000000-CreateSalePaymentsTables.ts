import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSalePaymentsTables1791720000000 implements MigrationInterface {
  name = 'CreateSalePaymentsTables1791720000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Añadir columnas de montos pagados a la tabla de ventas
    await queryRunner.query(`
      ALTER TABLE "sales"
        ADD COLUMN IF NOT EXISTS "paid_amount" numeric(14,4) NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "paid_amount_local" numeric(14,4) NOT NULL DEFAULT 0;
    `);

    // Sincronizar ventas ya marcadas como PAGADO para que su paid_amount sea igual a su total
    await queryRunner.query(`
      UPDATE "sales"
      SET "paid_amount" = "total",
          "paid_amount_local" = "total_local"
      WHERE "paid_status" = 'PAGADO';
    `);

    // 2. Crear tabla de cobros / pagos (sale_payments)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sale_payments" (
        "id" uuid NOT NULL,
        "payment_number" character varying(50) NOT NULL,
        "customer_name" character varying(150) NOT NULL,
        "customer_tax_id" character varying(50),
        "payment_date" TIMESTAMP NOT NULL DEFAULT now(),
        "payment_method" character varying(30) NOT NULL DEFAULT 'CASH',
        "reference" character varying(100),
        "amount" numeric(14,4) NOT NULL DEFAULT 0,
        "amount_local" numeric(14,4) NOT NULL DEFAULT 0,
        "exchange_rate" numeric(14,4) NOT NULL DEFAULT 1.0,
        "currency" character varying(10) NOT NULL DEFAULT 'USD',
        "receipt_url" text,
        "notes" text,
        "status" character varying(20) NOT NULL DEFAULT 'CONFIRMED',
        "created_by_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_sale_payments_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_sale_payments_payment_number" UNIQUE ("payment_number")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_sale_payments_customer_name" ON "sale_payments" ("customer_name");
      CREATE INDEX IF NOT EXISTS "IDX_sale_payments_payment_date" ON "sale_payments" ("payment_date");
      CREATE INDEX IF NOT EXISTS "IDX_sale_payments_status" ON "sale_payments" ("status");
    `);

    // 3. Crear tabla de asignaciones/cruces de cobro a ventas (sale_payment_allocations)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sale_payment_allocations" (
        "id" uuid NOT NULL,
        "payment_id" uuid NOT NULL,
        "sale_id" uuid NOT NULL,
        "amount_allocated" numeric(14,4) NOT NULL DEFAULT 0,
        "amount_allocated_local" numeric(14,4) NOT NULL DEFAULT 0,
        "difference_adjustment" numeric(14,4) NOT NULL DEFAULT 0,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sale_payment_allocations_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_allocations_payment" FOREIGN KEY ("payment_id") REFERENCES "sale_payments"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_allocations_sale" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_allocations_payment_id" ON "sale_payment_allocations" ("payment_id");
      CREATE INDEX IF NOT EXISTS "IDX_allocations_sale_id" ON "sale_payment_allocations" ("sale_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "sale_payment_allocations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sale_payments"`);
    await queryRunner.query(`
      ALTER TABLE "sales"
        DROP COLUMN IF EXISTS "paid_amount_local",
        DROP COLUMN IF EXISTS "paid_amount";
    `);
  }
}
