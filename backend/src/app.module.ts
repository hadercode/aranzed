import { Module } from '@nestjs/common';
import { IamModule } from './iam/iam.module';
import { CompanyModule } from './company/company.module';
import { AuditModule } from './audit/audit.module';
import { CatalogModule } from './catalog/catalog.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SalesModule } from './sales/sales.module';
import { InventoryModule } from './inventory/inventory.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: config.get<number>('DB_PORT') || 5432,
        username: config.get<string>('DB_USER') || 'postgres',
        password: config.get<string>('DB_PASSWORD') || '',
        database: config.get<string>('DB_NAME') || 'ministore_db',
        entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        migrationsRun: true,
        synchronize: false,
        logging: config.get<string>('DB_LOGGING') === 'true',
      }),
    }),
    IamModule,
    CompanyModule,
    AuditModule,
    CatalogModule,
    PurchasesModule,
    SalesModule,
    InventoryModule,
  ],
})
export class AppModule {}
