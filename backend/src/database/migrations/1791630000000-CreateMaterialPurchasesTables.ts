import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMaterialPurchasesTables1791630000000 implements MigrationInterface {
  name = 'CreateMaterialPurchasesTables1791630000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "material_purchases" (
        "id" uuid NOT NULL,
        "purchase_number" character varying(30) NOT NULL,
        "supplier_name" character varying(150) NOT NULL,
        "purchase_date" TIMESTAMP NOT NULL,
        "description" text,
        "status" character varying(20) NOT NULL DEFAULT 'DRAFT',
        "invoice_number" character varying(50) NOT NULL,
        "subtotal" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "tax_amount" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "created_by_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_material_purchases_number" UNIQUE ("purchase_number"),
        CONSTRAINT "PK_material_purchases_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "material_purchase_items" (
        "id" uuid NOT NULL,
        "purchase_id" uuid NOT NULL,
        "material_id" uuid NOT NULL,
        "description" character varying(255) NOT NULL,
        "quantity" numeric(14,4) NOT NULL DEFAULT 1.0000,
        "unit_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "is_taxable" boolean NOT NULL DEFAULT true,
        "tax_rate" numeric(5,2) NOT NULL DEFAULT 16.00,
        "tax_amount" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "subtotal" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "sort_order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_material_purchase_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_material_purchase_items_purchase" FOREIGN KEY ("purchase_id") REFERENCES "material_purchases"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_material_purchase_items_material" FOREIGN KEY ("material_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_material_purchases_number" ON "material_purchases" ("purchase_number")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_material_purchases_supplier" ON "material_purchases" ("supplier_name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_material_purchases_status" ON "material_purchases" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_material_purchases_invoice" ON "material_purchases" ("invoice_number")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_material_purchase_items_purchase_id" ON "material_purchase_items" ("purchase_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_material_purchase_items_material_id" ON "material_purchase_items" ("material_id")`,
    );

    // Insert permissions for purchases module
    await queryRunner.query(`
      INSERT INTO "permissions" ("id", "resource", "action")
      SELECT gen_random_uuid(), 'purchases', 'read'
      WHERE NOT EXISTS (
        SELECT 1 FROM "permissions" WHERE "resource" = 'purchases' AND "action" = 'read'
      )
    `);

    await queryRunner.query(`
      INSERT INTO "permissions" ("id", "resource", "action")
      SELECT gen_random_uuid(), 'purchases', 'manage'
      WHERE NOT EXISTS (
        SELECT 1 FROM "permissions" WHERE "resource" = 'purchases' AND "action" = 'manage'
      )
    `);

    // Assign purchases permissions to ADMIN_ROLE
    await queryRunner.query(`
      INSERT INTO "role_permissions" ("rolesId", "permissionsId")
      SELECT r."id", p."id"
      FROM "roles" r, "permissions" p
      WHERE r."name" = 'ADMIN_ROLE' AND p."resource" = 'purchases'
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "role_permissions"
      WHERE "permissionsId" IN (
        SELECT "id" FROM "permissions" WHERE "resource" = 'purchases'
      )
    `);
    await queryRunner.query(
      `DELETE FROM "permissions" WHERE "resource" = 'purchases'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_material_purchase_items_material_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_material_purchase_items_purchase_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_material_purchases_invoice"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_material_purchases_status"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_material_purchases_supplier"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_material_purchases_number"`,
    );
    await queryRunner.query(`DROP TABLE "material_purchase_items"`);
    await queryRunner.query(`DROP TABLE "material_purchases"`);
  }
}
