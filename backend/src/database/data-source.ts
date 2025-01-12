import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

const options: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DATABASE_NAME || 'data/school.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: true,
  logging: ['error', 'query', 'schema'],
};

export default new DataSource(options);
