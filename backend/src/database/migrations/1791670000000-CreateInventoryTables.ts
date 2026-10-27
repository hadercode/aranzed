import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInventoryTables1791670000000 implements MigrationInterface {
  name = 'CreateInventoryTables1791670000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tabla de Almacenes / Depósitos
    await queryRunner.query(`
      CREATE TABLE "warehouses" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "code" character varying(50) NOT NULL,
        "name" character varying(150) NOT NULL,
        "description" text,
        "address" text,
        "is_default" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_warehouses_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_warehouses_code" UNIQUE ("code")
      )
    `);

    // 2. Tabla de Movimientos de Inventario (Kardex Header)
    await queryRunner.query(`
      CREATE TABLE "inventory_movements" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "movement_number" character varying(50) NOT NULL,
        "movement_type" character varying(50) NOT NULL,
        "status" character varying(30) NOT NULL DEFAULT 'COMPLETED',
        "source_warehouse_id" uuid,
        "target_warehouse_id" uuid,
        "reason" text,
        "reference_type" character varying(50) NOT NULL DEFAULT 'MANUAL',
        "reference_id" character varying(100),
        "reference_number" character varying(100),
        "total_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total_cost_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "exchange_rate" numeric(14,4) NOT NULL DEFAULT 1.0000,
        "movement_date" TIMESTAMP NOT NULL DEFAULT now(),
        "created_by_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_movements_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_inventory_movements_number" UNIQUE ("movement_number"),
        CONSTRAINT "FK_movements_source_warehouse" FOREIGN KEY ("source_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_movements_target_warehouse" FOREIGN KEY ("target_warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT
      )
    `);

    // 3. Tabla de Ítems del Movimiento de Inventario (Kardex Detail)
    await queryRunner.query(`
      CREATE TABLE "inventory_movement_items" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "movement_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "quantity" numeric(14,4) NOT NULL DEFAULT 1.0000,
        "unit_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "unit_cost_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "total_cost_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "notes" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_movement_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_movement_items_movement" FOREIGN KEY ("movement_id") REFERENCES "inventory_movements"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_movement_items_product" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT
      )
    `);

    // 4. Tabla de Capas / Lotes FIFO (PEPS Layer Engine)
    await queryRunner.query(`
      CREATE TABLE "inventory_fifo_layers" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "warehouse_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "movement_id" uuid,
        "initial_quantity" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "remaining_quantity" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "unit_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "unit_cost_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "exchange_rate" numeric(14,4) NOT NULL DEFAULT 1.0000,
        "entry_date" TIMESTAMP NOT NULL DEFAULT now(),
        "is_exhausted" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_fifo_layers_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_fifo_layers_warehouse" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_fifo_layers_product" FOREIGN KEY ("product_id") REFERENCES "catalog_products"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_fifo_layers_movement" FOREIGN KEY ("movement_id") REFERENCES "inventory_movements"("id") ON DELETE SET NULL
      )
    `);

    // 5. Tabla de Consumos de Capas (Trazabilidad detallada de desahogo FIFO)
    await queryRunner.query(`
      CREATE TABLE "inventory_layer_consumptions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "movement_item_id" uuid NOT NULL,
        "layer_id" uuid NOT NULL,
        "quantity_consumed" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "unit_cost" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "unit_cost_local" numeric(14,4) NOT NULL DEFAULT 0.0000,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_layer_consumptions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_layer_consumptions_item" FOREIGN KEY ("movement_item_id") REFERENCES "inventory_movement_items"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_layer_consumptions_layer" FOREIGN KEY ("layer_id") REFERENCES "inventory_fifo_layers"("id") ON DELETE RESTRICT
      )
    `);

    // 6. Índices de Búsqueda y Optimización FIFO
    await queryRunner.query(`
      CREATE INDEX "IDX_fifo_layers_lookup" ON "inventory_fifo_layers" ("warehouse_id", "product_id", "is_exhausted", "entry_date" ASC)
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_movements_number" ON "inventory_movements" ("movement_number")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_movements_type" ON "inventory_movements" ("movement_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_movements_date" ON "inventory_movements" ("movement_date")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_movements_status" ON "inventory_movements" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_movement_items_mov" ON "inventory_movement_items" ("movement_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_movement_items_prod" ON "inventory_movement_items" ("product_id")
    `);

    // 7. Sembrar Almacén Principal por Defecto
    await queryRunner.query(`
      INSERT INTO "warehouses" ("id", "code", "name", "description", "is_default", "is_active")
      VALUES (
        gen_random_uuid(),
        'ALM-01',
        'Almacén Principal',
        'Depósito general central del sistema',
        true,
        true
      )
      ON CONFLICT ("code") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_movement_items_prod"`);
    await queryRunner.query(`DROP INDEX "IDX_movement_items_mov"`);
    await queryRunner.query(`DROP INDEX "IDX_movements_status"`);
    await queryRunner.query(`DROP INDEX "IDX_movements_date"`);
    await queryRunner.query(`DROP INDEX "IDX_movements_type"`);
    await queryRunner.query(`DROP INDEX "IDX_movements_number"`);
    await queryRunner.query(`DROP INDEX "IDX_fifo_layers_lookup"`);
    await queryRunner.query(`DROP TABLE "inventory_layer_consumptions"`);
    await queryRunner.query(`DROP TABLE "inventory_fifo_layers"`);
    await queryRunner.query(`DROP TABLE "inventory_movement_items"`);
    await queryRunner.query(`DROP TABLE "inventory_movements"`);
    await queryRunner.query(`DROP TABLE "warehouses"`);
  }
}
