import { AppDataSource } from '../../data-source';

/**
 * Tablas que serán vaciadas durante la limpieza de datos de prueba.
 * Se incluyen todas las transacciones operativas y los catálogos solicitados:
 * - Ventas (pagos, asignaciones, ítems y encabezados)
 * - Compras (ítems y compras de materia prima)
 * - Inventario (Kárdex, reservas, ítems, transacciones y existencias FIFO)
 * - Recetas (ingredientes e información general)
 * - Catálogo de Productos
 * - Categorías
 */
const BASE_TARGET_TABLES = [
  // 1. Ventas y Pagos
  'sale_payment_allocations',
  'sale_payments',
  'sale_items',
  'sales',

  // 2. Compras
  'material_purchase_items',
  'material_purchases',

  // 3. Inventario (Movimientos y Existencias)
  'inventory_stock_ledger_entries',
  'inventory_stock_reservations',
  'inventory_transaction_items',
  'inventory_transactions',
  'inventory_stocks',

  // 4. Catálogo de Recetas
  'catalog_recipe_items',
  'catalog_recipes',

  // 5. Catálogo de Productos
  'catalog_products',

  // 6. Categorías
  'catalog_categories',
];

/**
 * Tablas del sistema que NO se tocan para preservar la configuración base:
 * - Usuarios, roles y permisos
 * - Datos de la empresa
 * - Unidades de medida
 * - Almacenes configurados
 * - Motivos estándar de movimiento
 */
const PRESERVED_TABLES = [
  'users',
  'roles',
  'permissions',
  'role_permissions',
  'user_roles',
  'companies',
  'catalog_units_of_measure',
  'inventory_warehouses',
  'inventory_reasons',
];

async function cleanTestData() {
  const args = process.argv.slice(2);
  const includeAudit = args.includes('--include-audit') || args.includes('--audit');
  const force = args.includes('--force');

  console.log('\n======================================================');
  console.log('       LIMPIEZA DE DATOS DE PRUEBA (TEST DATA RESET)   ');
  console.log('======================================================\n');

  if (process.env.NODE_ENV === 'production' && !force) {
    console.error(
      '⚠️ ERROR DE SEGURIDAD: Estás en entorno de PRODUCCIÓN.\n' +
        'Para ejecutar esta limpieza en producción debes pasar el flag --force.\n',
    );
    process.exit(1);
  }

  const tablesToClean = [...BASE_TARGET_TABLES];
  if (includeAudit) {
    tablesToClean.push('audit_logs');
    console.log('ℹ️ Flag detectado: Se incluirá la tabla "audit_logs" en la limpieza.\n');
  }

  console.log('1. Conectando con la base de datos...');
  await AppDataSource.initialize();
  console.log('✓ Conexión establecida con éxito.\n');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    console.log('2. Contabilizando registros actuales...');
    const tableCountsBefore: Record<string, number> = {};

    for (const table of tablesToClean) {
      const res = await queryRunner.query(
        `SELECT COUNT(*)::int AS count FROM "${table}"`,
      );
      tableCountsBefore[table] = res[0]?.count || 0;
    }

    console.log('3. Ejecutando TRUNCATE atómico en transacción...');
    await queryRunner.startTransaction();

    const truncateSql = `TRUNCATE TABLE ${tablesToClean
      .map((t) => `"${t}"`)
      .join(', ')} RESTART IDENTITY CASCADE;`;

    await queryRunner.query(truncateSql);
    await queryRunner.commitTransaction();

    console.log('✓ Tablas limpiadas y secuencias reiniciadas correctamente.\n');

    // Resumen de registros eliminados
    console.log('------------------------------------------------------');
    console.log(' TABLA                             REGISTROS LIMPIADOS');
    console.log('------------------------------------------------------');
    let totalDeleted = 0;
    for (const table of tablesToClean) {
      const deleted = tableCountsBefore[table];
      totalDeleted += deleted;
      const paddedName = table.padEnd(36, ' ');
      console.log(` ${paddedName} ${deleted}`);
    }
    console.log('------------------------------------------------------');
    console.log(` TOTAL DE REGISTROS ELIMINADOS:    ${totalDeleted}\n`);

    // Verificación de datos preservados
    console.log('4. Verificando integridad de datos maestros preservados:');
    for (const table of PRESERVED_TABLES) {
      try {
        const res = await queryRunner.query(
          `SELECT COUNT(*)::int AS count FROM "${table}"`,
        );
        const count = res[0]?.count || 0;
        const paddedName = table.padEnd(30, ' ');
        console.log(`   ✓ ${paddedName} (${count} registros activos)`);
      } catch {
        // En caso de que la tabla aún no exista
      }
    }

    console.log('\n======================================================');
    console.log('       ✓ LIMPIEZA COMPLETADA SATISFACTORIAMENTE        ');
    console.log('======================================================\n');
  } catch (error) {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }
    console.error('\n❌ Error durante la limpieza de la base de datos:', error);
    process.exit(1);
  } finally {
    await queryRunner.release();
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

cleanTestData().catch((err) => {
  console.error('Error fatal no controlado:', err);
  process.exit(1);
});

