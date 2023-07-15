import { Module, Provider } from '@nestjs/common';
import { PG_CONNECTION } from '../constants';
import { Pool } from 'pg';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const dbProvider: Provider = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number.parseInt(process.env.POSTGRES_PORT),
    ssl: {
      rejectUnauthorized: false,
    },
  }),
};

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DbModule {}
