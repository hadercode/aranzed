import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateElementalInventoryTables1791690000000 implements MigrationInterface {
  name = 'CreateElementalInventoryTables1791690000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 0. Limpieza defensiva de tablas borrador previas si existieran
    await queryRunner.query(
      `DROP VIEW IF EXISTS "v_inventory_adjustments_report" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_layer_consumptions" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_fifo_layers" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_movement_items" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_movements" CASCADE;`,
    );

    // 1. Tabla: inventory_warehouses
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_warehouses" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" uuid,
        "company_id" uuid,
        "code" character varying(50) NOT NULL,
        "name" character varying(100) NOT NULL,
        "location" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "is_sales_warehouse" boolean NOT NULL DEFAULT false,
        "created_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_inventory_warehouses_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_inventory_warehouses_code" UNIQUE ("code")
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_inventory_warehouses_sales_warehouse"
      ON "inventory_warehouses" ("is_sales_warehouse")
      WHERE is_sales_warehouse = true AND deleted_at IS NULL;
    `);

    // 2. Tabla: inventory_warehouse_responsibles
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_warehouse_responsibles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" uuid,
        "company_id" uuid,
        "warehouse_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "is_primary" boolean NOT NULL DEFAULT false,
        "created_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_inventory_warehouse_responsibles_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_responsibles_warehouse" FOREIGN KEY ("warehouse_id")
          REFERENCES "inventory_warehouses"("id") ON DELETE CASCADE
      );
    `);

    // 3. Tabla: inventory_reasons
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_reasons" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" uuid,
        "company_id" uuid,
        "name" character varying(50) NOT NULL,
        "type" character varying(20) NOT NULL,
        "description" character varying(255),
        "created_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_inventory_reasons_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_inventory_reasons_name" UNIQUE ("name")
      );
    `);

    // 4. Tabla: inventory_transactions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_transactions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" uuid,
        "company_id" uuid,
        "transaction_number" character varying(50) NOT NULL,
        "type" character varying(30) NOT NULL,
        "reason_id" uuid,
        "origin_warehouse_id" uuid,
        "dest_warehouse_id" uuid,
        "status" character varying(30) NOT NULL DEFAULT 'DRAFT',
        "movement_date" DATE NOT NULL DEFAULT CURRENT_DATE,
        "reference_entity_type" character varying(50),
        "reference_entity_id" uuid,
        "notes" text,
        "documents" jsonb,
        "created_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_inventory_transactions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_inventory_transactions_number" UNIQUE ("transaction_number"),
        CONSTRAINT "FK_inventory_tx_reason" FOREIGN KEY ("reason_id")
          REFERENCES "inventory_reasons"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_inventory_tx_origin_wh" FOREIGN KEY ("origin_warehouse_id")
          REFERENCES "inventory_warehouses"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_inventory_tx_dest_wh" FOREIGN KEY ("dest_warehouse_id")
          REFERENCES "inventory_warehouses"("id") ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inventory_tx_date" ON "inventory_transactions" ("movement_date");
      CREATE INDEX IF NOT EXISTS "IDX_inventory_tx_type" ON "inventory_transactions" ("type");
      CREATE INDEX IF NOT EXISTS "IDX_inventory_tx_status" ON "inventory_transactions" ("status");
    `);

    // 5. Tabla: inventory_transaction_items
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_transaction_items" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "transaction_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "variant_id" uuid,
        "sku_snapshot" character varying(100) NOT NULL,
        "name_snapshot" character varying(500) NOT NULL,
        "uom_symbol" character varying(10) NOT NULL,
        "quantity" numeric(19,5) NOT NULL,
        "cost" numeric(19,5),
        "sec_quantity" numeric(19,5),
        "sec_uom_symbol" character varying(10),
        "batch_number" character varying(100),
        "expiry_date" DATE,
        "custom_comment" text,
        "tenant_id" uuid,
        "company_id" uuid,
        "created_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_transaction_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_item_transaction" FOREIGN KEY ("transaction_id")
          REFERENCES "inventory_transactions"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_inventory_item_product" FOREIGN KEY ("product_id")
          REFERENCES "catalog_products"("id") ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inventory_items_tx" ON "inventory_transaction_items" ("transaction_id");
      CREATE INDEX IF NOT EXISTS "IDX_inventory_items_product" ON "inventory_transaction_items" ("product_id");
    `);

    // 6. Tabla: inventory_stocks
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_stocks" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" uuid,
        "company_id" uuid,
        "warehouse_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "variant_id" uuid,
        "sku_snapshot" character varying(100) NOT NULL,
        "product_name_snapshot" character varying(500) NOT NULL,
        "batch_number" character varying(100),
        "entry_date" DATE NOT NULL DEFAULT CURRENT_DATE,
        "uom_original_qty" numeric(19,5) NOT NULL DEFAULT 0.00000,
        "physical_qty" numeric(19,5) NOT NULL DEFAULT 0.00000,
        "reserved_qty" numeric(19,5) NOT NULL DEFAULT 0.00000,
        "uom_symbol" character varying(10) NOT NULL,
        "sec_uom_original_qty" numeric(19,5),
        "sec_physical_qty" numeric(19,5),
        "sec_reserved_qty" numeric(19,5),
        "sec_uom_symbol" character varying(10),
        "exchange_rate_id" uuid,
        "exchange_rate_snapshot" numeric(19,5) NOT NULL DEFAULT 1.00000,
        "unit_cost_base" numeric(19,5) NOT NULL DEFAULT 0.00000,
        "currency_code_base" character varying(3) NOT NULL DEFAULT 'USD',
        "unit_cost_local" numeric(19,5) NOT NULL DEFAULT 0.00000,
        "currency_code_local" character varying(3) NOT NULL DEFAULT 'VES',
        "unit_cost" numeric(19,5) NOT NULL DEFAULT 0.00000,
        "currency_code" character varying(3) NOT NULL DEFAULT 'USD',
        "is_depleted" boolean NOT NULL DEFAULT false,
        "created_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_inventory_stocks_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_stocks_warehouse" FOREIGN KEY ("warehouse_id")
          REFERENCES "inventory_warehouses"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_inventory_stocks_product" FOREIGN KEY ("product_id")
          REFERENCES "catalog_products"("id") ON DELETE RESTRICT,
        CONSTRAINT "chk_physical_qty_non_negative" CHECK ("physical_qty" >= 0),
        CONSTRAINT "chk_reserved_qty_non_negative" CHECK ("reserved_qty" >= 0)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inventory_stocks_lookup"
      ON "inventory_stocks" ("warehouse_id", "product_id", "is_depleted", "entry_date" ASC);
    `);

    // 7. Tabla: inventory_stock_reservations
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_stock_reservations" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" uuid,
        "company_id" uuid,
        "stock_id" uuid NOT NULL,
        "reference_type" character varying(50) NOT NULL,
        "reference_id" uuid NOT NULL,
        "reference_item_id" uuid,
        "reserved_qty" numeric(19,5) NOT NULL,
        "sec_reserved_qty" numeric(19,5),
        "status" character varying(30) NOT NULL DEFAULT 'ACTIVE',
        "created_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_inventory_stock_reservations_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_reservations_stock" FOREIGN KEY ("stock_id")
          REFERENCES "inventory_stocks"("id") ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inventory_reservations_ref"
      ON "inventory_stock_reservations" ("reference_type", "reference_id");
    `);

    // 8. Tabla: inventory_stock_ledger_entries (Kárdex)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_stock_ledger_entries" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id" uuid,
        "company_id" uuid,
        "transaction_item_id" uuid NOT NULL,
        "stock_id" uuid NOT NULL,
        "quantity" numeric(19,5) NOT NULL,
        "sec_quantity" numeric(19,5),
        "unit_cost" numeric(19,5) NOT NULL,
        "total_cost" numeric(19,5) NOT NULL,
        "created_by_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_inventory_stock_ledger_entries_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_ledger_tx_item" FOREIGN KEY ("transaction_item_id")
          REFERENCES "inventory_transaction_items"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_inventory_ledger_stock" FOREIGN KEY ("stock_id")
          REFERENCES "inventory_stocks"("id") ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_inventory_ledger_stock_item"
      ON "inventory_stock_ledger_entries" ("stock_id", "transaction_item_id");
    `);

    // 9. Vista Analítica de Mermas y Ajustes
    await queryRunner.query(`
      CREATE OR REPLACE VIEW "v_inventory_adjustments_report" AS
      SELECT 
        l.id,
        t.tenant_id,
        t.company_id,
        COALESCE(t.origin_warehouse_id, t.dest_warehouse_id) AS warehouse_id,
        COALESCE(r.name, 'Ajuste Directo') AS adjustment_reason,
        t.type AS transaction_type,
        i.product_id,
        i.variant_id,
        i.sku_snapshot,
        i.name_snapshot,
        i.uom_symbol,
        l.quantity AS quantity_adjusted,
        l.unit_cost AS unit_cost,
        l.total_cost AS cost_impact,
        t.movement_date,
        t.transaction_number,
        t.created_by_id
      FROM inventory_stock_ledger_entries l
      JOIN inventory_transaction_items i ON l.transaction_item_id = i.id
      JOIN inventory_transactions t ON i.transaction_id = t.id
      LEFT JOIN inventory_reasons r ON t.reason_id = r.id
      WHERE t.status = 'COMPLETED'
        AND (t.type = 'ADJUSTMENT' OR r.name ILIKE '%merma%' OR r.name ILIKE '%diferencia%' OR r.name ILIKE '%pérdida%');
    `);

    // 10. Datos iniciales (Almacén Principal y Motivos estándar)
    await queryRunner.query(`
      INSERT INTO "inventory_warehouses" ("id", "code", "name", "location", "is_sales_warehouse", "is_active")
      VALUES (
        gen_random_uuid(),
        'ALM-01',
        'Almacén Principal',
        'Depósito Central',
        true,
        true
      )
      ON CONFLICT ("code") DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO "inventory_reasons" ("id", "name", "type", "description")
      VALUES 
        (gen_random_uuid(), 'Ajuste Físico (Entrada)', 'INPUT', 'Sobrante detectado en auditoría o conteo físico'),
        (gen_random_uuid(), 'Ajuste Físico (Salida)', 'OUTPUT', 'Faltante detectado en auditoría o conteo físico'),
        (gen_random_uuid(), 'Merma por Daño / Vencimiento', 'OUTPUT', 'Pérdida por deterioro, daño o vencimiento de producto'),
        (gen_random_uuid(), 'Consumo Interno', 'OUTPUT', 'Uso interno de insumos o materiales del negocio'),
        (gen_random_uuid(), 'Muestra / Promoción', 'OUTPUT', 'Muestra comercial o degustación')
      ON CONFLICT ("name") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP VIEW IF EXISTS "v_inventory_adjustments_report" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_stock_ledger_entries" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_stock_reservations" CASCADE;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_stocks" CASCADE;`);
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_transaction_items" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_transactions" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_reasons" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_warehouse_responsibles" CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "inventory_warehouses" CASCADE;`,
    );
  }
}
