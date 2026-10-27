import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1791610000000 implements MigrationInterface {
  name = 'CreateProductsTable1791610000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "catalog_products" (
        "id" uuid NOT NULL,
        "name" character varying(150) NOT NULL,
        "description" text,
        "image_url" character varying(500),
        "type" character varying(30) NOT NULL DEFAULT 'TRADITIONAL',
        "uom_id" uuid NOT NULL,
        "category_id" uuid,
        "profit_margin" numeric(10,2) NOT NULL DEFAULT 0,
        "last_cost" numeric(14,4) NOT NULL DEFAULT 0,
        "last_sale_price" numeric(14,4) NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_by_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_catalog_products_name" UNIQUE ("name"),
        CONSTRAINT "PK_catalog_products_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_catalog_products_uom" FOREIGN KEY ("uom_id") REFERENCES "catalog_units_of_measure"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_catalog_products_category" FOREIGN KEY ("category_id") REFERENCES "catalog_categories"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_products_name" ON "catalog_products" ("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_products_type" ON "catalog_products" ("type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_products_uom_id" ON "catalog_products" ("uom_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_products_category_id" ON "catalog_products" ("category_id")`,
    );

    // Insert permissions for products module
    await queryRunner.query(`
      INSERT INTO "permissions" ("id", "resource", "action")
      SELECT gen_random_uuid(), 'products', 'read'
      WHERE NOT EXISTS (
        SELECT 1 FROM "permissions" WHERE "resource" = 'products' AND "action" = 'read'
      )
    `);

    await queryRunner.query(`
      INSERT INTO "permissions" ("id", "resource", "action")
      SELECT gen_random_uuid(), 'products', 'manage'
      WHERE NOT EXISTS (
        SELECT 1 FROM "permissions" WHERE "resource" = 'products' AND "action" = 'manage'
      )
    `);

    // Assign products permissions to ADMIN_ROLE
    await queryRunner.query(`
      INSERT INTO "role_permissions" ("rolesId", "permissionsId")
      SELECT r."id", p."id"
      FROM "roles" r, "permissions" p
      WHERE r."name" = 'ADMIN_ROLE' AND p."resource" = 'products'
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "role_permissions"
      WHERE "permissionsId" IN (
        SELECT "id" FROM "permissions" WHERE "resource" = 'products'
      )
    `);
    await queryRunner.query(
      `DELETE FROM "permissions" WHERE "resource" = 'products'`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_catalog_products_category_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_catalog_products_uom_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_catalog_products_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_catalog_products_name"`);
    await queryRunner.query(`DROP TABLE "catalog_products"`);
  }
}
