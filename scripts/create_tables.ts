import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';

import { getKnexClient } from './utils/db_utils';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);
  await createCartsTable();
  await createCartItemsTable();
  await application.close();
  process.exit(0);
}

async function createCartsTable() {
  const client = getKnexClient();
  const tableName = process.env.CARTS_TABLE_NAME;
  const result = await client.schema.createTable(tableName, (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable();
    table.date('created_at').notNullable();
    table.date('updated_at').notNullable();
    table.enum('status', ['OPEN', 'ORDERED']);
  });
  console.log(result);
}

async function createCartItemsTable() {
  const client = getKnexClient();
  const tableName = process.env.CART_ITEMS_TABLE_NAME;
  const cartsTableName = process.env.CARTS_TABLE_NAME;

  const result = await client.schema.createTable(tableName, (table) => {
    table.uuid('cart_id').references(`${cartsTableName}.id`);
    table.uuid('product_id');
    table.integer('count');
  });
  console.log(result);
}

bootstrap();
