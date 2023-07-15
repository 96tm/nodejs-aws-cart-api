import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';

import { getKnexClient } from './utils/db_utils';
import { CARTS } from './mocks/carts';
import { CART_ITEMS } from './mocks/cart_items';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);
  const userId = await seedUsersTable();
  const cartId = await seedCartsTable(userId);
  await seedCartItemsTable(cartId);
  await application.close();
  process.exit(0);
}

async function seedUsersTable(): Promise<string> {
  const tableName = process.env.USERS_TABLE_NAME;
  try {
    const rows = await getKnexClient()
      .table(tableName)
      .insert([
        {
          name: process.env.AUTH_USER_NAME,
          password: process.env.AUTH_USER_PASSWORD,
        },
      ])
      .returning('id');
    console.log(rows);
    return rows[0].id;
  } catch (err) {
    console.error(err);
  }
}

async function seedCartsTable(userId: string): Promise<string> {
  const tableName = process.env.CARTS_TABLE_NAME;
  try {
    const rows = await getKnexClient()
      .table(tableName)
      .insert(CARTS.map((item) => ({ ...item, user_id: userId })))
      .returning('id');
    console.log(rows);
    return rows[0].id;
  } catch (err) {
    console.error(err);
  }
}

async function seedCartItemsTable(cartId: string): Promise<void> {
  const tableName = process.env.CART_ITEMS_TABLE_NAME;
  const productsTableName = process.env.PRODUCTS_TABLE_NAME;
  const client = getKnexClient();
  try {
    const product = await client.table(productsTableName).first();
    const result = await getKnexClient()
      .table(tableName)
      .insert(
        CART_ITEMS.map((item) => ({
          ...item,
          cart_id: cartId,
          product_id: product.id,
        })),
      );
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
