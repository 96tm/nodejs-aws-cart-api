import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';

import { getKnexClient } from './utils/db_utils';
import { CARTS } from './mocks/carts';
import { CART_ITEMS } from './mocks/cart_items';

async function bootstrap() {
  const application = await NestFactory.createApplicationContext(AppModule);
  await seedCartsTable();
  await seedCartItemsTable();
  await application.close();
  process.exit(0);
}

async function seedCartsTable(): Promise<void> {
  const tableName = process.env.CARTS_TABLE_NAME;
  try {
    const result = await getKnexClient().table(tableName).insert(CARTS);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

async function seedCartItemsTable(): Promise<void> {
  const tableName = process.env.CART_ITEMS_TABLE_NAME;
  const items = CART_ITEMS;
  for (const item of items) {
    const randomCartId = CARTS[Math.floor(Math.random() * CARTS.length)].id;
    item.cart_id = randomCartId;
  }
  try {
    const result = await getKnexClient().table(tableName).insert(items);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

bootstrap();
