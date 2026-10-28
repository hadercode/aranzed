import { AppDataSource } from '../../data-source';
import { UserOrmEntity } from '../iam/infrastructure/persistence/typeorm/entities/user.orm-entity';
import { RoleOrmEntity } from '../iam/infrastructure/persistence/typeorm/entities/role.orm-entity';
import { PermissionOrmEntity } from '../iam/infrastructure/persistence/typeorm/entities/permission.orm-entity';
import { CompanyOrmEntity } from '../company/infrastructure/persistence/typeorm/entities/company.orm-entity';
import { CategoryOrmEntity } from '../catalog/categories/infrastructure/persistence/typeorm/entities/category.orm-entity';
import { UnitOfMeasureOrmEntity } from '../catalog/units-of-measure/infrastructure/persistence/typeorm/entities/unit-of-measure.orm-entity';
import { ProductOrmEntity } from '../catalog/products/infrastructure/persistence/typeorm/entities/product.orm-entity';
import { ProductType } from '../catalog/products/domain/enums/product-type.enum';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

async function seed() {
  console.log('Initializing database connection...');
  await AppDataSource.initialize();
  console.log('Database connected!');

  console.log('Ensuring all pending migrations are applied...');
  await AppDataSource.runMigrations();
  console.log('Migrations verified.');

  const roleRepo = AppDataSource.getRepository(RoleOrmEntity);
  const userRepo = AppDataSource.getRepository(UserOrmEntity);

  const permissionRepo = AppDataSource.getRepository(PermissionOrmEntity);

  console.log('Seeding permissions...');
  let manageUsersPerm = await permissionRepo.findOneBy({
    resource: 'users',
    action: 'manage',
  });
  if (!manageUsersPerm) {
    manageUsersPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'users',
      action: 'manage',
    });
    await permissionRepo.save(manageUsersPerm);
  }

  let manageRolesPerm = await permissionRepo.findOneBy({
    resource: 'roles',
    action: 'manage',
  });
  if (!manageRolesPerm) {
    manageRolesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'roles',
      action: 'manage',
    });
    await permissionRepo.save(manageRolesPerm);
  }

  let manageCompanyPerm = await permissionRepo.findOneBy({
    resource: 'company',
    action: 'manage',
  });
  if (!manageCompanyPerm) {
    manageCompanyPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'company',
      action: 'manage',
    });
    await permissionRepo.save(manageCompanyPerm);
  }

  let readCompanyPerm = await permissionRepo.findOneBy({
    resource: 'company',
    action: 'read',
  });
  if (!readCompanyPerm) {
    readCompanyPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'company',
      action: 'read',
    });
    await permissionRepo.save(readCompanyPerm);
  }

  let readAuditPerm = await permissionRepo.findOneBy({
    resource: 'audit',
    action: 'read',
  });
  if (!readAuditPerm) {
    readAuditPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'audit',
      action: 'read',
    });
    await permissionRepo.save(readAuditPerm);
  }

  let manageAuditPerm = await permissionRepo.findOneBy({
    resource: 'audit',
    action: 'manage',
  });
  if (!manageAuditPerm) {
    manageAuditPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'audit',
      action: 'manage',
    });
    await permissionRepo.save(manageAuditPerm);
  }

  let readCategoriesPerm = await permissionRepo.findOneBy({
    resource: 'categories',
    action: 'read',
  });
  if (!readCategoriesPerm) {
    readCategoriesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'categories',
      action: 'read',
    });
    await permissionRepo.save(readCategoriesPerm);
  }

  let manageCategoriesPerm = await permissionRepo.findOneBy({
    resource: 'categories',
    action: 'manage',
  });
  if (!manageCategoriesPerm) {
    manageCategoriesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'categories',
      action: 'manage',
    });
    await permissionRepo.save(manageCategoriesPerm);
  }

  let readUofmPerm = await permissionRepo.findOneBy({
    resource: 'uofm',
    action: 'read',
  });
  if (!readUofmPerm) {
    readUofmPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'uofm',
      action: 'read',
    });
    await permissionRepo.save(readUofmPerm);
  }

  let manageUofmPerm = await permissionRepo.findOneBy({
    resource: 'uofm',
    action: 'manage',
  });
  if (!manageUofmPerm) {
    manageUofmPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'uofm',
      action: 'manage',
    });
    await permissionRepo.save(manageUofmPerm);
  }

  let readProductsPerm = await permissionRepo.findOneBy({
    resource: 'products',
    action: 'read',
  });
  if (!readProductsPerm) {
    readProductsPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'products',
      action: 'read',
    });
    await permissionRepo.save(readProductsPerm);
  }

  let manageProductsPerm = await permissionRepo.findOneBy({
    resource: 'products',
    action: 'manage',
  });
  if (!manageProductsPerm) {
    manageProductsPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'products',
      action: 'manage',
    });
    await permissionRepo.save(manageProductsPerm);
  }

  let readRecipesPerm = await permissionRepo.findOneBy({
    resource: 'recipes',
    action: 'read',
  });
  if (!readRecipesPerm) {
    readRecipesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'recipes',
      action: 'read',
    });
    await permissionRepo.save(readRecipesPerm);
  }

  let manageRecipesPerm = await permissionRepo.findOneBy({
    resource: 'recipes',
    action: 'manage',
  });
  if (!manageRecipesPerm) {
    manageRecipesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'recipes',
      action: 'manage',
    });
    await permissionRepo.save(manageRecipesPerm);
  }

  let readPurchasesPerm = await permissionRepo.findOneBy({
    resource: 'purchases',
    action: 'read',
  });
  if (!readPurchasesPerm) {
    readPurchasesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'purchases',
      action: 'read',
    });
    await permissionRepo.save(readPurchasesPerm);
  }

  let managePurchasesPerm = await permissionRepo.findOneBy({
    resource: 'purchases',
    action: 'manage',
  });
  if (!managePurchasesPerm) {
    managePurchasesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'purchases',
      action: 'manage',
    });
    await permissionRepo.save(managePurchasesPerm);
  }

  let readSalesPerm = await permissionRepo.findOneBy({
    resource: 'sales',
    action: 'read',
  });
  if (!readSalesPerm) {
    readSalesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'sales',
      action: 'read',
    });
    await permissionRepo.save(readSalesPerm);
  }

  let manageSalesPerm = await permissionRepo.findOneBy({
    resource: 'sales',
    action: 'manage',
  });
  if (!manageSalesPerm) {
    manageSalesPerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'sales',
      action: 'manage',
    });
    await permissionRepo.save(manageSalesPerm);
  }

  let readStoragePerm = await permissionRepo.findOneBy({
    resource: 'storage',
    action: 'read',
  });
  if (!readStoragePerm) {
    readStoragePerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'storage',
      action: 'read',
    });
    await permissionRepo.save(readStoragePerm);
  }

  let uploadStoragePerm = await permissionRepo.findOneBy({
    resource: 'storage',
    action: 'upload',
  });
  if (!uploadStoragePerm) {
    uploadStoragePerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'storage',
      action: 'upload',
    });
    await permissionRepo.save(uploadStoragePerm);
  }

  let manageStoragePerm = await permissionRepo.findOneBy({
    resource: 'storage',
    action: 'manage',
  });
  if (!manageStoragePerm) {
    manageStoragePerm = permissionRepo.create({
      id: randomUUID(),
      resource: 'storage',
      action: 'manage',
    });
    await permissionRepo.save(manageStoragePerm);
  }

  const allAdminPerms = [
    manageUsersPerm,
    manageRolesPerm,
    manageCompanyPerm,
    readCompanyPerm,
    readAuditPerm,
    manageAuditPerm,
    readCategoriesPerm,
    manageCategoriesPerm,
    readUofmPerm,
    manageUofmPerm,
    readProductsPerm,
    manageProductsPerm,
    readRecipesPerm,
    manageRecipesPerm,
    readPurchasesPerm,
    managePurchasesPerm,
    readSalesPerm,
    manageSalesPerm,
    readStoragePerm,
    uploadStoragePerm,
    manageStoragePerm,
  ];

  console.log('Seeding roles...');
  let adminRole = await roleRepo.findOneBy({ name: 'ADMIN_ROLE' });
  if (!adminRole) {
    adminRole = roleRepo.create({
      id: randomUUID(),
      name: 'ADMIN_ROLE',
      description: 'Administrator role',
      permissions: allAdminPerms,
    });
    await roleRepo.save(adminRole);
    console.log('Created ADMIN_ROLE');
  } else {
    adminRole.permissions = allAdminPerms;
    await roleRepo.save(adminRole);
    console.log('ADMIN_ROLE already exists, updated permissions');
  }

  let userRole = await roleRepo.findOneBy({ name: 'USER_ROLE' });
  const userPerms = [
    readCompanyPerm,
    readCategoriesPerm,
    readUofmPerm,
    readProductsPerm,
    readSalesPerm,
    manageSalesPerm,
    readStoragePerm,
    uploadStoragePerm,
  ];

  if (!userRole) {
    userRole = roleRepo.create({
      id: randomUUID(),
      name: 'USER_ROLE',
      description: 'Standard user role',
      permissions: userPerms,
    });
    await roleRepo.save(userRole);
    console.log('Created USER_ROLE with operational permissions');
  } else {
    userRole.permissions = userPerms;
    await roleRepo.save(userRole);
    console.log('USER_ROLE already exists, updated permissions');
  }

  console.log('Seeding users...');
  const passwordHash = await bcrypt.hash('123456', 10);

  let adminUser = await userRepo.findOneBy({ email: 'admin@example.com' });
  if (!adminUser) {
    adminUser = userRepo.create({
      id: randomUUID(),
      email: 'admin@example.com',
      passwordHash,
      roles: [adminRole],
    });
    await userRepo.save(adminUser);
    console.log('Created Admin User (admin@example.com / 123456)');
  } else {
    console.log('Admin User already exists');
  }

  let normalUser = await userRepo.findOneBy({ email: 'user@example.com' });
  if (!normalUser) {
    normalUser = userRepo.create({
      id: randomUUID(),
      email: 'user@example.com',
      passwordHash,
      roles: [userRole],
    });
    await userRepo.save(normalUser);
    console.log('Created Normal User (user@example.com / 123456)');
  } else {
    console.log('Normal User already exists');
  }

  console.log('Seeding company configuration...');
  const companyRepo = AppDataSource.getRepository(CompanyOrmEntity);
  const existingCompany = await companyRepo.find({ take: 1 });
  if (existingCompany.length === 0) {
    const defaultCompany = companyRepo.create({
      id: randomUUID(),
      identificationNumber: 'J-12345678-0',
      legalName: 'Nexus Global S.A.S.',
      tradeName: 'Nexus ERP',
      slogan: 'Innovación y eficiencia empresarial',
      phone: '+1 (555) 019-2834',
      secondaryPhone: '+1 (555) 019-2835',
      email: 'contacto@nexus.com',
      website: 'https://nexus.com',
      address: 'Avenida Empresarial # 45-67',
      addressLine2: 'Torre Nexus, Piso 10',
      city: 'Bogotá D.C.',
      state: 'Cundinamarca',
      zipCode: '110111',
      country: 'Colombia',
      currencyCode: 'USD',
      currencySymbol: '$',
      currencyPosition: 'left',
      decimalPlaces: 2,
      timezone: 'America/Bogota',
      dateFormat: 'YYYY-MM-DD',
      smtpHost: 'smtp.nexus.com',
      smtpPort: 587,
      smtpUser: 'no-reply@nexus.com',
      smtpPassword: '',
      smtpSecure: false,
      smtpFromName: 'Nexus ERP Notificaciones',
      smtpFromEmail: 'no-reply@nexus.com',
      taxRegime: 'Régimen Común - Responsable de IVA',
      footerNotes:
        'Gracias por su preferencia. Documento electrónico emitido conforme a las regulaciones vigentes.',
    });
    await companyRepo.save(defaultCompany);
    console.log('Created default company configuration');
  } else {
    console.log('Company configuration already exists');
  }

  console.log('Seeding catalog categories...');
  const categoryRepo = AppDataSource.getRepository(CategoryOrmEntity);
  const defaultCategories = [
    { name: 'Electrónica y Tecnología', path: 'Electrónica y Tecnología' },
    { name: 'Hogar y Muebles', path: 'Hogar y Muebles' },
    { name: 'Ropa y Calzado', path: 'Ropa y Calzado' },
    { name: 'Alimentos y Bebidas', path: 'Alimentos y Bebidas' },
    { name: 'Servicios Profesionales', path: 'Servicios Profesionales' },
  ];

  for (const catData of defaultCategories) {
    const existingCat = await categoryRepo.findOne({
      where: { name: catData.name },
      withDeleted: true,
    });
    if (!existingCat) {
      const cat = categoryRepo.create({
        id: randomUUID(),
        name: catData.name,
        path: catData.path,
        isActive: true,
      });
      await categoryRepo.save(cat);
      console.log(`Created category: ${catData.name}`);
    } else if (existingCat.deletedAt) {
      existingCat.deletedAt = null;
      existingCat.isActive = true;
      await categoryRepo.save(existingCat);
    }
  }

  console.log('Seeding catalog units of measure...');
  const uofmRepo = AppDataSource.getRepository(UnitOfMeasureOrmEntity);
  const defaultUoms = [
    { code: 'UND', name: 'Unidad', allowDecimals: false },
    { code: 'KG', name: 'Kilogramo', allowDecimals: true },
    { code: 'GR', name: 'Gramo', allowDecimals: true },
    { code: 'LT', name: 'Litro', allowDecimals: true },
    { code: 'ML', name: 'Mililitro', allowDecimals: true },
    { code: 'M', name: 'Metro', allowDecimals: true },
    { code: 'PAQ', name: 'Paquete', allowDecimals: false },
    { code: 'CAJA', name: 'Caja', allowDecimals: false },
  ];

  for (const uomData of defaultUoms) {
    const existingUom = await uofmRepo.findOne({
      where: { code: uomData.code },
      withDeleted: true,
    });
    if (!existingUom) {
      const uom = uofmRepo.create({
        id: randomUUID(),
        code: uomData.code,
        name: uomData.name,
        isActive: true,
        allowDecimals: uomData.allowDecimals,
      });
      await uofmRepo.save(uom);
      console.log(`Created Unit of Measure: ${uomData.code} - ${uomData.name}`);
    } else if (existingUom.deletedAt) {
      existingUom.deletedAt = null;
      existingUom.isActive = true;
      await uofmRepo.save(existingUom);
    }
  }

  console.log('Seeding catalog products...');
  const productRepo = AppDataSource.getRepository(ProductOrmEntity);
  const undUom = await uofmRepo.findOne({
    where: { code: 'UND' },
    withDeleted: true,
  });
  const techCat = await categoryRepo.findOne({
    where: { name: 'Electrónica y Tecnología' },
    withDeleted: true,
  });
  const homeCat = await categoryRepo.findOne({
    where: { name: 'Hogar y Muebles' },
    withDeleted: true,
  });
  const servCat = await categoryRepo.findOne({
    where: { name: 'Servicios Profesionales' },
    withDeleted: true,
  });

  if (undUom) {
    const defaultProducts = [
      {
        name: 'Laptop Ultra Pro 15',
        description:
          'Laptop potente con procesador de última generación y 16GB RAM',
        imageUrl:
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
        type: ProductType.TRADITIONAL,
        uomId: undUom.id,
        categoryId: techCat?.id,
        profitMargin: 30,
        lastCost: 850,
        lastSalePrice: 1105,
        isActive: true,
      },
      {
        name: 'Escritorio Ergonómico Premium',
        description:
          'Mobiliario modular ensamblado en madera tratada con altura ajustable',
        imageUrl:
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
        type: ProductType.FINISHED_GOOD,
        uomId: undUom.id,
        categoryId: homeCat?.id,
        profitMargin: 40,
        lastCost: 150,
        lastSalePrice: 210,
        isActive: true,
      },
      {
        name: 'Mantenimiento y Soporte TI Especializado',
        description:
          'Póliza de soporte técnico preventivo y correctivo por equipo',
        imageUrl:
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
        type: ProductType.SERVICE,
        uomId: undUom.id,
        categoryId: servCat?.id,
        profitMargin: 60,
        lastCost: 50,
        lastSalePrice: 80,
        isActive: true,
      },
      {
        name: 'Tablero de Madera de Roble Tratada',
        description:
          'Materia prima cortada y tratada para manufactura de escritorios',
        imageUrl:
          'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=600&q=80',
        type: ProductType.RAW_MATERIAL,
        uomId: undUom.id,
        categoryId: homeCat?.id,
        profitMargin: 20,
        lastCost: 45,
        lastSalePrice: 54,
        isActive: true,
      },
      {
        name: 'Estructura Metálica y Tornillería de Ensamble',
        description:
          'Juego de patas telescópicas metálicas y herrajes para ensamble',
        imageUrl:
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        type: ProductType.RAW_MATERIAL,
        uomId: undUom.id,
        categoryId: homeCat?.id,
        profitMargin: 25,
        lastCost: 55,
        lastSalePrice: 68.75,
        isActive: true,
      },
      {
        name: 'Mano de Obra - Ensamblaje y Pulido',
        description:
          'Servicio técnico especializado de armado, lijado y control de calidad',
        imageUrl:
          'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
        type: ProductType.SERVICE,
        uomId: undUom.id,
        categoryId: servCat?.id,
        profitMargin: 50,
        lastCost: 30,
        lastSalePrice: 45,
        isActive: true,
      },
    ];

    for (const prodData of defaultProducts) {
      const existingProd = await productRepo.findOne({
        where: { name: prodData.name },
        withDeleted: true,
      });
      if (!existingProd) {
        const prod = productRepo.create({
          id: randomUUID(),
          ...prodData,
        });
        await productRepo.save(prod);
        console.log(`Created product: [${prodData.type}] ${prodData.name}`);
      } else if (existingProd.deletedAt) {
        existingProd.deletedAt = null;
        existingProd.isActive = true;
        await productRepo.save(existingProd);
      }
    }
  }

  console.log('Seeding completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
