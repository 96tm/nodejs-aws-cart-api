import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

import { Cart, CartStatus, CartUpdateDTO } from '../models';
import { PG_CONNECTION } from '../../constants';

@Injectable()
export class CartService {
  private cartsTableName = process.env.CARTS_TABLE_NAME;
  private cartItemsTableName = process.env.CART_ITEMS_TABLE_NAME;
  private productsTableName = process.env.PRODUCTS_TABLE_NAME;

  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}

  async findByUserId(userId: string): Promise<Cart> {
    const result = await this.pool.query({
      text: `SELECT carts.id, carts.user_id, carts.created_at, carts.updated_at, carts.status,
        COALESCE(array_agg(
          json_build_object(
            'cart_id', cart_items.cart_id,
            'product_id', cart_items.product_id,
            'count', cart_items.count,
            'product', json_build_object(
              'price', products.price,
              'title', products.title,
              'description', products.description,
              'id', products.id
            )
          )
        ) FILTER (WHERE cart_items.product_id IS NOT NULL), '{}') AS items
        FROM ${this.cartsTableName} AS carts
        LEFT JOIN ${this.cartItemsTableName} AS cart_items
        ON carts.id=cart_items.cart_id
        LEFT JOIN ${this.productsTableName} AS products
        ON cart_items.product_id=products.id
        WHERE carts.user_id=$1
        GROUP BY carts.id`,
      values: [userId],
    });
    console.log(result.rows);
    return result.rows[0] as Cart;
  }

  async createByUserId(userId: string): Promise<Cart> {
    const result = await this.pool.query({
      text: `
        INSERT INTO ${this.cartsTableName}
        (user_id, status)
        VALUES ($1, $2)
        RETURNING id, user_id, created_at, updated_at`,
      values: [userId, CartStatus.Open],
    });
    console.log(result);
    const cart = result.rows[0];
    const returned: Cart = {
      items: [],
      createdAt: cart.created_at,
      updatedAt: cart.updated_at,
      id: cart.id,
      status: cart.status,
      userId,
    };
    return returned;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    { items }: CartUpdateDTO,
  ): Promise<Cart> {
    const { id: cartId } = await this.findOrCreateByUserId(userId);
    await this.pool.query('BEGIN');
    await this.pool.query(
      `DELETE FROM ${this.cartItemsTableName} as cart_items WHERE cart_items.cart_id=$1`,
      [cartId],
    );
    for (const item of items) {
      await this.pool.query(
        `INSERT INTO ${this.cartItemsTableName} (cart_id, product_id, count) VALUES($1, $2, $3)`,
        [cartId, item.productId, item.count],
      );
    }
    await this.pool.query('COMMIT');
    const updatedCart = await this.findByUserId(userId);
    return updatedCart;
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.pool.query(
      `DELETE FROM ${this.cartsTableName} WHERE user_id=$1`,
      [userId],
    );
  }
}
