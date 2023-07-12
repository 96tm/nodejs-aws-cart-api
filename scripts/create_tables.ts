import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';

import { getKnexClient } from './utils/db_utils';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);
  await createDatabase();
  await createUsersTable();
  await createCartsTable();
  await createCartItemsTable();
  await createOrdersTable();
  await application.close();
  process.exit(0);
}

async function createUsersTable() {
  const client = getKnexClient();
  const tableName = process.env.USERS_TABLE_NAME;
  const result = await client.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable(tableName, (table) => {
      table.uuid('id').primary().defaultTo(client.raw('uuid_generate_v4()'));
      table.string('name', 64).notNullable().unique();
      table.string('password', 256).defaultTo('').notNullable();
      table.string('email', 320).defaultTo('').notNullable();
    });
  console.log(result);
}

async function createCartsTable() {
  const client = getKnexClient();
  const tableName = process.env.CARTS_TABLE_NAME;
  const usersTableName = process.env.USERS_TABLE_NAME;

  const result = await client.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().defaultTo(client.raw('uuid_generate_v4()'));
    table
      .uuid('user_id')
      .references(`${usersTableName}.id`)
      .onDelete('CASCADE');
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(client.raw('now()'));
    table
      .timestamp('updated_at', { useTz: true })
      .notNullable()
      .defaultTo(client.raw('now()'));
    table.enum('status', ['OPEN', 'ORDERED']).notNullable();
  });
  console.log(result);
}

async function createCartItemsTable() {
  const client = getKnexClient();
  const tableName = process.env.CART_ITEMS_TABLE_NAME;
  const cartsTableName = process.env.CARTS_TABLE_NAME;
  const productsTableName = process.env.PRODUCTS_TABLE_NAME;

  const result = await client.schema.createTable(tableName, (table) => {
    table
      .uuid('cart_id')
      .references(`${cartsTableName}.id`)
      .onDelete('CASCADE');
    table
      .uuid('product_id')
      .references(`${productsTableName}.id`)
      .onDelete('CASCADE');
    table.integer('count').notNullable().checkPositive();
  });
  console.log(result);
}

async function createOrdersTable() {
  const client = getKnexClient();
  const tableName = process.env.ORDERS_TABLE_NAME;
  const usersTableName = process.env.USERS_TABLE_NAME;
  const cartsTableName = process.env.CARTS_TABLE_NAME;

  const result = await client.schema.createTable(tableName, (table) => {
    table.uuid('id').primary().defaultTo(client.raw('uuid_generate_v4()'));
    table
      .uuid('user_id')
      .references(`${usersTableName}.id`)
      .onDelete('SET NULL');
    table
      .uuid('cart_id')
      .references(`${cartsTableName}.id`)
      .onDelete('SET NULL');
    table.json('payment');
    table.json('delivery');
    table.decimal('total', 9, 2).notNullable().checkPositive();
    table.string('comments', 1024).notNullable().defaultTo('');
    table.enum('status', ['OPEN', 'ORDERED']).notNullable();
  });
  console.log(result);
}

async function createDatabase(): Promise<void> {
  try {
    const client = getKnexClient('template1');
    const result = await client.raw(
      `CREATE DATABASE ${process.env.POSTGRES_NAME};`,
    );
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
