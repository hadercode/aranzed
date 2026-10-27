import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCatalogTables1791600000000 implements MigrationInterface {
  name = 'CreateCatalogTables1791600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "catalog_categories" (
        "id" uuid NOT NULL,
        "name" character varying(100) NOT NULL,
        "parent_id" uuid,
        "path" character varying,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_by_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_catalog_categories_name" UNIQUE ("name"),
        CONSTRAINT "PK_catalog_categories_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_categories_path" ON "catalog_categories" ("path")`,
    );

    await queryRunner.query(`
      CREATE TABLE "catalog_units_of_measure" (
        "id" uuid NOT NULL,
        "code" character varying(10) NOT NULL,
        "name" character varying(50) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "allow_decimals" boolean NOT NULL DEFAULT true,
        "created_by_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "UQ_catalog_units_of_measure_code" UNIQUE ("code"),
        CONSTRAINT "PK_catalog_units_of_measure_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_catalog_units_of_measure_code" ON "catalog_units_of_measure" ("code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_catalog_units_of_measure_code"`,
    );
    await queryRunner.query(`DROP TABLE "catalog_units_of_measure"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_catalog_categories_path"`,
    );
    await queryRunner.query(`DROP TABLE "catalog_categories"`);
  }
}
