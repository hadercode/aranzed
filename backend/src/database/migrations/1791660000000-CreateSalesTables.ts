import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSalesTables1791660000000 implements MigrationInterface {
  name = 'CreateSalesTables1791660000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "sales" (
        "id" uuid NOT NULL,
        "sale_number" character varying(50) NOT NULL,
        "sale_type" character varying(30) NOT NULL DEFAULT 'DIRECT_SALE',
        "status" character varying(30) NOT NULL DEFAULT 'DRAFT',
        "customer_name" character varying(150) NOT NULL DEFAULT 'Consumidor Final',
        "customer_tax_id" character varying(50),
        "customer_email" character varying(150),
        "customer_phone" character varying(50),
        "customer_address" text,
        "notes" text,
        "payment_method" character varying(30) NOT NULL DEFAULT 'CASH',
        "payment_notes" text,
        "sale_date" TIMESTAMP NOT NULL DEFAULT now(),
        "valid_until" TIMESTAMP,
        "exchange_rate" numeric(14,4) NOT NULL DEFAULT 1.0000,
        "functional_currency" character varying(10) NOT NULL DEFAULT 'USD',
        "local_currency" character varying(10) NOT NULL DEFAULT 'VES',
        "document_currency" character varying(10) NOT NULL DEFAULT 'USD',
        "subtotal" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "discount_amount" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "tax_amount" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "subtotal_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "discount_amount_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "tax_amount_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "converted_from_quotation_id" uuid,
        "created_by_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_sales_sale_number" UNIQUE ("sale_number"),
        CONSTRAINT "PK_sales_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "sale_items" (
        "id" uuid NOT NULL,
        "sale_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "description" character varying(255) NOT NULL,
        "product_type" character varying(30) NOT NULL DEFAULT 'TRADITIONAL',
        "quantity" numeric(14,4) NOT NULL DEFAULT 1.0000,
        "unit_price" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "unit_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "discount_rate" numeric(5,2) NOT NULL DEFAULT 0.00,
        "discount_amount" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "is_taxable" boolean NOT NULL DEFAULT true,
        "tax_rate" numeric(5,2) NOT NULL DEFAULT 16.00,
        "tax_amount" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "subtotal" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "unit_price_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "subtotal_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "discount_amount_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "tax_amount_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "currency_symbol_functional" character varying(5) NOT NULL DEFAULT '$',
        "currency_symbol_local" character varying(5) NOT NULL DEFAULT 'Bs.',
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sale_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_sale_items_sale" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_sale_items_product" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_sales_sale_number" ON "sales" ("sale_number")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_sale_type" ON "sales" ("sale_type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_status" ON "sales" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_customer_name" ON "sales" ("customer_name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_sale_date" ON "sales" ("sale_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sale_items_sale_id" ON "sale_items" ("sale_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sale_items_product_id" ON "sale_items" ("product_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_sale_items_product_id"`);
    await queryRunner.query(`DROP INDEX "IDX_sale_items_sale_id"`);
    await queryRunner.query(`DROP INDEX "IDX_sales_sale_date"`);
    await queryRunner.query(`DROP INDEX "IDX_sales_customer_name"`);
    await queryRunner.query(`DROP INDEX "IDX_sales_status"`);
    await queryRunner.query(`DROP INDEX "IDX_sales_sale_type"`);
    await queryRunner.query(`DROP INDEX "IDX_sales_sale_number"`);
    await queryRunner.query(`DROP TABLE "sale_items"`);
    await queryRunner.query(`DROP TABLE "sales"`);
  }
}
