import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecipesTables1791620000000 implements MigrationInterface {
  name = 'CreateRecipesTables1791620000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "catalog_recipes" (
        "id" uuid NOT NULL,
        "code" character varying(30) NOT NULL,
        "name" character varying(150) NOT NULL,
        "description" text,
        "product_id" uuid NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'DRAFT',
        "yield_quantity" numeric(14,4) NOT NULL DEFAULT 1.0000,
        "total_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "created_by_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_catalog_recipes_code" UNIQUE ("code"),
        CONSTRAINT "PK_catalog_recipes_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_catalog_recipes_product" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "catalog_recipe_items" (
        "id" uuid NOT NULL,
        "recipe_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "quantity" numeric(14,4) NOT NULL DEFAULT 1.0000,
        "unit_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "subtotal_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "notes" character varying(255),
        "sort_order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_catalog_recipe_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_catalog_recipe_items_recipe" FOREIGN KEY ("recipe_id") REFERENCES "catalog_recipes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_catalog_recipe_items_product" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_recipes_code" ON "catalog_recipes" ("code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_recipes_product_id" ON "catalog_recipes" ("product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_recipes_status" ON "catalog_recipes" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_recipe_items_recipe_id" ON "catalog_recipe_items" ("recipe_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_recipe_items_product_id" ON "catalog_recipe_items" ("product_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_catalog_recipe_items_product_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_catalog_recipe_items_recipe_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_catalog_recipes_status"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_catalog_recipes_product_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_catalog_recipes_code"`);
    await queryRunner.query(`DROP TABLE "catalog_recipe_items"`);
    await queryRunner.query(`DROP TABLE "catalog_recipes"`);
  }
}
