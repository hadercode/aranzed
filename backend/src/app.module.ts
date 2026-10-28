import { Module } from '@nestjs/common';
import { IamModule } from './iam/iam.module';
import { CompanyModule } from './company/company.module';
import { AuditModule } from './audit/audit.module';
import { CatalogModule } from './catalog/catalog.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SalesModule } from './sales/sales.module';
import { InventoryModule } from './inventory/inventory.module';
import { StorageModule } from './storage/storage.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}.local`,
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
        '.env',
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get<string>('NODE_ENV') === 'production';
        const isSslEnabled =
          config.get<string>('DB_SSL') === 'true' ||
          (isProduction && config.get<string>('DB_SSL') !== 'false');

        const rawPassword = config.get('DB_PASSWORD');
        const password =
          rawPassword !== undefined && rawPassword !== null
            ? String(rawPassword)
            : '';

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST') || 'localhost',
          port: Number(config.get('DB_PORT')) || 5432,
          username: String(config.get('DB_USER') || 'postgres'),
          password,
          database: config.get<string>('DB_NAME') || 'ministore_db',
          entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
          migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          migrationsRun: true,
          synchronize: false,
          ssl: isSslEnabled
            ? {
                rejectUnauthorized: false,
              }
            : false,
          logging: config.get<string>('DB_LOGGING') === 'true',
        };
      },
    }),
    IamModule,
    CompanyModule,
    AuditModule,
    CatalogModule,
    PurchasesModule,
    SalesModule,
    InventoryModule,
    StorageModule,
    DashboardModule,
  ],
})
export class AppModule {}
