import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { Listing } from '../listings/entities/listing.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Contract } from '../contracts/entities/contract.entity';

const entities = [User, Listing, Payment, Notification, Contract];

function useSsl(): boolean | { rejectUnauthorized: boolean } {
  if (process.env.DATABASE_SSL === 'false') {
    return false;
  }
  if (process.env.DATABASE_SSL === 'true') {
    return { rejectUnauthorized: false };
  }
  const url = process.env.DATABASE_URL || '';
  if (/neon\.tech|sslmode=require|ssl=true/i.test(url)) {
    return { rejectUnauthorized: false };
  }
  return false;
}

function migrationsGlob(): string {
  return join(__dirname, '..', 'migrations', '*.{ts,js}');
}

/**
 * Options shared by Nest `TypeOrmModule` and the CLI `DataSource` (migrations).
 */
export function getTypeOrmDataSourceOptions(): DataSourceOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const ssl = useSsl();

  const base: DataSourceOptions = {
    type: 'postgres',
    entities,
    migrations: [migrationsGlob()],
    synchronize: !isProduction,
    logging: process.env.NODE_ENV === 'development',
  };

  if (databaseUrl) {
    return {
      ...base,
      url: databaseUrl,
      ssl,
    };
  }

  const portRaw = process.env.DATABASE_PORT;
  const port = parseInt(portRaw || '5432', 10);

  return {
    ...base,
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number.isFinite(port) ? port : 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'rentdirect',
    ssl,
  };
}

export function getNestTypeOrmModuleOptions(): TypeOrmModuleOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const runOnStart =
    process.env.TYPEORM_MIGRATIONS_RUN !== 'false' && isProduction;

  return {
    ...getTypeOrmDataSourceOptions(),
    migrationsRun: runOnStart,
  } as TypeOrmModuleOptions;
}
