import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config(); // Load .env file

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ministore_db',
  synchronize: false,
  ssl:
    process.env.DB_SSL === 'true' ||
    (process.env.NODE_ENV === 'production' && process.env.DB_SSL !== 'false')
      ? { rejectUnauthorized: false }
      : false,
  logging: process.env.DB_LOGGING === 'true',
  entities: [join(__dirname, '**/*.orm-entity{.ts,.js}')],
  migrations: [
    join(__dirname, 'src/database/migrations/*{.ts,.js}'),
    join(__dirname, 'database/migrations/*{.ts,.js}'),
  ],
});
