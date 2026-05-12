import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';
import { getTypeOrmDataSourceOptions } from './database/typeorm.config';

loadEnv({ path: '.env' });

export default new DataSource(getTypeOrmDataSourceOptions());
