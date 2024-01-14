import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const typeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'dev',
  logging: process.env.NODE_ENV !== 'production',
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
};
